import frappe


@frappe.whitelist(allow_guest=True)
def add_comment_to_item(name=None, comment=None):
    if not name:
        return

    item = frappe.get_doc("Item", name)
    item.add_comment("Comment", comment)
