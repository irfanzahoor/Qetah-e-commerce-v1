import frappe
import stripe


@frappe.whitelist()
def add_to_cart(id):
    try:
        user = frappe.session.user
        if not user == "Guest":
            if not frappe.db.exists("Cart", {"product": id, "user": user}):
                doc = frappe.new_doc("Cart")
                doc.user = user
                doc.product = id
                doc.insert()
                return {
                    "success": True,
                    "response": "Item added successfully!",
                    "name": doc.name,
                    "product": doc.product,
                }
            else:
                return {"success": False, "response": "Item Already exists in cart!"}
        else:
            return {"success": False, "response": "You need to be login first!"}
    except:
        return {"success": False, "response": "Something went wrong!"}


@frappe.whitelist()
def remove_from_cart(id, cart_name):
    name = cart_name if cart_name else id
    try:
        user = frappe.session.user
        frappe.db.delete("Cart", {"name": name, "user": user})
        return {"success": True, "response": "Item removed successfully!"}
    except:
        return {"success": False, "response": "Something went wrong!"}


@frappe.whitelist()
def checkout(**form):
    firstname = form.get("firstname")
    lastname = form.get("lastname")
    email = form.get("email")
    phone = form.get("phone")
    country = form.get("country")
    state = form.get("state")
    city = form.get("city")
    postal_code = form.get("zip")
    address_1 = form.get("address_1")
    address_2 = form.get("address_2")
    token = form.get("token")

    if not firstname:
        return {"success": False, "response": "First Name is required"}
    elif not lastname:
        return {"success": False, "response": "Last Name is required"}
    elif not email:
        return {"success": False, "response": "Email address is required"}
    elif not phone:
        return {"success": False, "response": "Phone is required"}
    elif not country:
        return {"success": False, "response": "Country is required"}
    elif not state:
        return {"success": False, "response": "State is required"}
    elif not city:
        return {"success": False, "response": "City is required"}
    elif not postal_code:
        return {"success": False, "response": "Postal code is required"}
    elif not address_1:
        return {"success": False, "response": "Address 1 is required"}
    elif not token:
        return {"success": False, "response": "Token is missing"}
    else:
        try:
            settings = frappe.db.get_value(
                "My Web Settings", None, ["stripe_private_key"], as_dict=True
            )
            user = frappe.session.user
            query = """
                SELECT v.price, v.discount, p.featured_image, 
                p.name AS product_name, p.title AS product_title,
                v.title AS variation_title, v.name AS variation_name
                FROM `tabCart` AS c
                LEFT JOIN  `tabProduct Variation` AS v ON v.name = c.product
                LEFT JOIN  `tabProduct` AS p ON p.name = v.parent
            """

            products = frappe.db.sql(query, {"user": user}, as_dict=True)
            if products:
                stripe.api_key = settings.stripe_private_key
                subtotal = 0
                total = 0
                tax = 0
                address = {
                    "country": country,
                    "city": city,
                    "state": state,
                    "postal_code": postal_code,
                    "line2": address_2,
                    "line1": address_1,
                }
                for item in products:
                    subtotal += item.discount if item.discount else item.price
                total = tax + subtotal
                amount = round(float(total) * 100)
                customer = stripe.Customer.create(
                    email=email,
                    name=f"{firstname} {lastname}",
                    phone=phone,
                    address=address,
                    source=token,
                )
                charge = stripe.Charge.create(
                    amount=amount,
                    customer=customer.id,
                    currency="usd",
                    description="Payment",
                    metadata={
                        "products": ", ".join(
                            f"{item['product_title']}({item['variation_title']})"
                            for item in products
                        ),
                    },
                )
                if charge.paid:
                    order = frappe.new_doc("Order")
                    order.payment_id = charge.id
                    order.user = user
                    order.receipt_url = charge.receipt_url
                    order.first_name = firstname
                    order.last_name = lastname
                    order.email = email
                    order.phone = phone
                    order.country = country
                    order.state = state
                    order.city = city
                    order.postal_code = postal_code
                    order.address_1 = address_1
                    order.address_2 = address_2
                    order.tax = tax
                    order.total = total
                    order.sub_total = subtotal
                    for item in products:
                        order.append(
                            "ordered_products",
                            {
                                "doctype": "Order Product",
                                "product": item.product_name,
                                "variation": item.variation_name,
                                "price": item.price,
                                "discount": item.discount,
                            },
                        )
                    order.insert()
                    # frappe.db.delete("Cart", {"user": user})
                    frappe.db.commit()
                    return {
                        "success": True,
                        "response": "Payment Successful!",
                        "name": order.name,
                    }
                else:
                    return {"success": False, "response": "Payment Is Unsuccessful!"}
            else:
                return {
                    "success": False,
                    "response": "Your cart is empty please add some products first!",
                }
        except Exception as e:
            return {
                "success": False,
                "response": ",".join(e.args) if len(e.args) > 0 else "Unknown Error",
            }


@frappe.whitelist()
def listing(**data):
    limit = data.get("limit", 6)
    page = data.get("page", 1)
    limit = int(limit)
    page = int(page)
    user = frappe.session.user

    count = frappe.db.count(
        "Cart",
        filters={"user": user},
    )

    start = (page - 1) * limit
    end = start + limit

    query = """
        SELECT c.name AS cart_name, v.price, v.discount, p.alt, p.featured_image, p.name, p.title, pc.name AS category_name, pc.title AS category_title,
        v.title AS variation
        FROM `tabCart` AS c
        LEFT JOIN  `tabProduct Variation` AS v ON v.name = c.product
        LEFT JOIN  `tabProduct` AS p ON p.name = v.parent
        LEFT JOIN  `tabProduct Category` AS pc ON pc.name = p.category 
    """

    products = frappe.db.sql(query, {"user": user}, as_dict=True)

    results = []
    for product in products:
        results.append(
            {
                "cart_name": product.get("cart_name"),
                "name": product.get("name"),
                "title": product.get("title"),
                "image": product.get("featured_image"),
                "alt": product.get("alt"),
                "price": product.get("price"),
                "discount": product.get("discount"),
                "variation": product.get("variation"),
                "category_name": product.get("category_name"),
                "category_title": product.get("category_title"),
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
