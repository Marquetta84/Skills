"""
Prominent Roofing — local backend.

Serves the static site and handles contact form submissions at POST /api/contact.
Leads are validated and appended to server/leads.csv. Run locally with:

    pip install -r server/requirements.txt
    python server/app.py

Then open http://localhost:5000
"""
import csv
import os
import re
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory

SITE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LEADS_FILE = os.path.join(os.path.dirname(__file__), "leads.csv")
LEADS_HEADER = ["timestamp", "name", "email", "phone", "message"]

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_RE = re.compile(r"^[0-9()+\-.\s]{7,}$")

app = Flask(__name__, static_folder=None)


def validate_lead(data):
    errors = {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    message = (data.get("message") or "").strip()

    if len(name) < 2:
        errors["name"] = "Please enter your full name."
    if not EMAIL_RE.match(email):
        errors["email"] = "Please enter a valid email address."
    if not PHONE_RE.match(phone):
        errors["phone"] = "Please enter a valid phone number."
    if len(message) < 10:
        errors["message"] = "Please tell us a bit more about your roofing need."

    return errors, {"name": name, "email": email, "phone": phone, "message": message}


def save_lead(lead):
    is_new = not os.path.exists(LEADS_FILE)
    with open(LEADS_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=LEADS_HEADER)
        if is_new:
            writer.writeheader()
        writer.writerow({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "name": lead["name"],
            "email": lead["email"],
            "phone": lead["phone"],
            "message": lead["message"],
        })


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    errors, lead = validate_lead(data)
    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    save_lead(lead)
    return jsonify({"ok": True, "message": "Thanks! We'll be in touch shortly."}), 200


@app.get("/")
def index():
    return send_from_directory(SITE_ROOT, "index.html")


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(SITE_ROOT, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
