import frappe
import os
import datetime


def Redirect(route):
    frappe.local.flags.redirect_location = route
    raise frappe.Redirect


def LoggedOutRedirect(route):
    if frappe.session.user and frappe.session.user == "Guest":

        Redirect(route)


def IsLoggedOut():
    if frappe.session.user and frappe.session.user == "Guest":
        return True
    else:
        return False


def LoggedInRedirect(route):
    if not frappe.session.user or frappe.session.user != "Guest":
        Redirect(route)


def IsLoggedIn():
    if not frappe.session.user or frappe.session.user != "Guest":
        return True
    else:
        return False


def store_file(fieldname, is_private=0, doctype="", docname="", folder=""):
    file = frappe.request.files.get(fieldname)
    current_datetime = datetime.datetime.now()
    formatted_datetime = current_datetime.strftime("%Y%m%d_%H%M%S")
    security = "public" if is_private == 0 else "private"

    if file:
        filename = file.filename
        file_data = file.read()
        unique_filename = f"{formatted_datetime}-{filename}"
        # Define the complete path to save the file
        path = os.path.join(
            os.getcwd(),
            frappe.local.site,
            os.path.join(f"{security}/files", folder, unique_filename),
        )

        # Create the necessary directories if they don't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)

        # Write the file data to the specified path
        with open(path, "wb") as f:
            f.write(file_data)

        complete_path = os.path.join("/files", folder, unique_filename)

        return complete_path
    else:
        return False


def setSession(key, value):
    frappe.cache().hset("session_values", key, value)


def getSession(key):
    return frappe.cache().hget("session_values", key)
