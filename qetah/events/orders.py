import frappe


@frappe.whitelist(allow_guest=True)
def listing(**data):
    limit = data.get("limit", 6)
    page = data.get("page", 1)
    search = data.get("search", None)
    sort = data.get("sort", "desc")
    limit = int(limit)
    page = int(page)
    user = frappe.session.user
    filters = {"owner": user}

    count = frappe.db.count("Order", filters=filters)

    start = (page - 1) * limit
    end = start + limit

    listing = frappe.db.get_all(
        "Order",
        fields=[
            "name",
            "payment_id",
            "first_name",
            "last_name",
            "total",
            "sub_total",
            "tax",
            "email",
        ],
        filters=filters,
        limit=limit,
        start=start,
        order_by=f"`creation` {sort}",
    )

    results = []
    for order in listing:
        results.append(
            {
                "name": order.get("name"),
                "payment_id": order.get("payment_id"),
                "first_name": order.get("first_name"),
                "last_name": order.get("last_name"),
                "total": order.get("total"),
                "subtotal": order.get("subtotal"),
                "tax": order.get("tax"),
                "email": order.get("email"),
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
