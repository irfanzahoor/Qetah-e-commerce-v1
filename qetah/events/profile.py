from qetah.utils import store_file
import frappe


@frappe.whitelist()
def profile_image(**form):
    try:
        user = frappe.session.user
        user = frappe.get_doc("User", user)
        user.user_image = store_file(fieldname="image")
        user.save()
        return {"success": True, "response": "Profile image updated successfully"}
    except:
        return {"success": False, "response": "Something went wrong!"}
