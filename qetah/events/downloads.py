import frappe


@frappe.whitelist()
def listing(**data):
    limit = data.get("limit", 6)
    page = data.get("page", 1)
    limit = int(limit)
    page = int(page)
    user = frappe.session.user
    sort = data.get("sort", "desc")

    count = frappe.db.count(
        "Download",
        filters={"owner": user},
    )

    start = (page - 1) * limit
    end = start + limit

    query = f"""
        SELECT d.name AS download_name, v.price, v.discount, p.alt, 
        p.featured_image, p.name AS product_name, p.title AS product_title,
        v.name AS variation_name, v.title AS variation_title, p.file,
        c.name AS category_name, c.title AS category_title
        FROM `tabDownload` AS d
        LEFT JOIN `tabProduct Variation` AS v ON v.name = d.variation
        LEFT JOIN `tabProduct` AS p ON p.name = v.parent
        LEFT JOIN `tabProduct Category` AS c ON c.name = p.category
        WHERE d.owner = %(user)s ORDER BY d.creation {sort}
    """

    products = frappe.db.sql(query, {"user": user}, as_dict=True)
    print(products)
    results = []
    for product in products:
        results.append(
            {
                "download": product.get("download"),
                "product_name": product.get("product_name"),
                "product_title": product.get("product_title"),
                "variation_name": product.get("variation_name"),
                "variation_title": product.get("variation_title"),
                "category_name": product.get("category_name"),
                "category_title": product.get("category_title"),
                "image": product.get("featured_image"),
                "alt": product.get("alt"),
                "file": product.get("file"),
                "price": product.get("price"),
                "discount": product.get("discount"),
            }
        )

    next_page = None if end >= count else page + 1
    back_page = None if page <= 1 else page - 1

    return {
        "count": count,
        "next": next_page,
        "back": back_page,
        "results": results,
    }
