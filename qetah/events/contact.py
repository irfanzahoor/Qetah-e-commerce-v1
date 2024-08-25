import frappe


@frappe.whitelist(allow_guest=True)
def create(**form):
    fullname = form.get("fullname")
    email = form.get("email")
    phone = form.get("phone")
    message = form.get("message")

    if not fullname:
        return {"success": False, "response": "Full Name is required"}
    elif not email:
        return {"success": False, "response": "Email address is required"}
    elif not message:
        return {"success": False, "response": "Message is required"}
    else:
        query = frappe.new_doc("Query")
        query.fullname = fullname
        query.email = email
        query.phone = phone
        query.message = message
        query.is_replied = False
        query.insert()
    return {
        "success": True,
        "response": "Please expect reply from us on your given email in 1 business day",
    }
