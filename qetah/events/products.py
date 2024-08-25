import frappe
from qetah.models import products


@frappe.whitelist(allow_guest=True)
def listing(**data):
    limit = data.get("limit", 6)
    page = data.get("page", 1)
    categories = data.get("categories", None)
    search = data.get("search", None)
    sort = data.get("sort", "desc")
    limit = int(limit)
    page = int(page)

    filters = {"is_active": 1}
    if categories:
        filters["category"] = ["in", categories.split(",")]
    if search:
        filters["title"] = ["like", f"%{search}%"]

    count = frappe.db.count(
        "Product",
        filters=filters,
    )

    start = (page - 1) * limit
    end = start + limit

    results = products(filters=filters, start=start, limit=limit, order_by=sort)

    next_page = None if end >= count else page + 1
    back_page = None if page <= 1 else page - 1

    return {
        "count": count,
        "next": next_page,
        "back": back_page,
        "results": results,
    }
