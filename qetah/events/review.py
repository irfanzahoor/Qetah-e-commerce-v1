import frappe


@frappe.whitelist()
def create(product, stars, parent, description=None):
    username = frappe.session.user
    user = frappe.get_doc("User", username)

    review = frappe.new_doc("Comment")
    review.comment_type = "Comment"
    review.reference_doctype = "Product"
    review.reference_name = product
    review.content = description
    review.published = True
    review.owner = user.name
    review.custom_stars = 4
    review.comment_by = user.name
    review.comment_email = user.email
    review.insert()

    user = frappe.get_doc(
        "User", review.get("owner"), fields=["first_name", "last_name", "user_image"]
    )

    return {
        "name": review.get("name"),
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "image": user.get("user_image", ""),
        "content": review.get("content"),
        "creation": review.get("creation"),
        "is_owner": True if username == user.get("name") else False,
    }


@frappe.whitelist()
def delete(name):
    try:
        frappe.delete_doc("Comment", name)
        return {"success": True, "response": "Review removed successfully!"}
    except:
        return {"success": False, "response": "Something went wrong!"}


@frappe.whitelist()
def update(review_id, description=None):
    username = frappe.session.user
    user = frappe.get_doc("User", username)

    review = frappe.get_doc("Comment", review_id)
    review.content = description
    review.save()

    user = frappe.get_doc(
        "User", review.get("owner"), fields=["first_name", "last_name", "user_image"]
    )
    return {
        "name": review.get("name"),
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "image": user.get("user_image", ""),
        "content": review.get("content"),
        "creation": review.get("creation"),
        "is_owner": True if username == user.get("name") else False,
    }


@frappe.whitelist(allow_guest=True)
def listing(**data):
    frappe.flags.ignore_permissions = True
    limit = data.get("limit", 6)
    page = data.get("page", 1)
    product = data.get("product", None)
    limit = int(limit)
    page = int(page)
    sort = data.get("sort", "desc")
    username = frappe.session.user

    filters = {
        "reference_name": product,
        "reference_doctype": "Product",
        "comment_type": "Comment",
        "published": True,
    }
    count = frappe.db.count("Comment", filters=filters)
    start = (page - 1) * limit
    end = start + limit
    comments = frappe.get_all(
        "Comment",
        filters=filters,
        fields=["name", "content", "creation", "owner"],
        limit=limit,
        start=start,
        order_by=f"`creation` {sort}",
    )

    results = []
    for item in comments:
        user = frappe.get_doc(
            "User",
            item.get("owner"),
            fields=["name", "first_name", "last_name", "user_image"],
        )
        results.append(
            {
                "first_name": user.get("first_name", ""),
                "last_name": user.get("last_name", ""),
                "image": user.get("user_image", ""),
                "content": item.get("content"),
                "name": item.get("name"),
                "creation": item.get("creation"),
                "is_owner": True if username == user.get("name") else False,
            }
        )
        print(username == user.get("name"))
    next_page = None if end >= count else page + 1
    back_page = None if page <= 1 else page - 1

    return {
        "count": count,
        "next": next_page,
        "back": back_page,
        "results": results,
    }
