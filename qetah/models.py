import frappe


def products(filters={}, limit=8, start=0, order_by="DESC"):
    listing = frappe.db.get_all(
        "Product",
        fields=[
            "name",
            "title",
            "excerpt",
            "featured_image",
            "category",
        ],
        filters=filters,
        limit=limit,
        start=start,
        order_by=f"`order` {order_by}",
    )

    results = []
    for product in listing:
        vars = []
    
        variations = frappe.db.get_all(
            "Product Variation",
            filters=[{"parent": product.name}],
            fields=["price", "discount"],
        )

        if variations:
            for item in variations:
                vars.append(
                    {
                        "price": item.price,
                        "discount": item.discount,
                    }
                )
        else:
            vars = None

        results.append(
            {
                "name": product.get("name"),
                "title": product.get("title"),
                "excerpt": product.get("excerpt"),
                "image": product.get("featured_image"),
                "category": product.get("category"),
                "variations": vars,
            }
        )

    return results
