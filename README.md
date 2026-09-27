# RentEase
A full-stack platform that connects PG (Paying Guest) / rental property owners with their tenants — replacing scattered WhatsApp messages, cash receipts, and paper notices with a single system for rent, complaints, and communication.

"A management system for PG owners + a portal for tenants."

📖 Overview

Managing a PG or rental property today is mostly manual — rent is tracked in notebooks or spreadsheets, complaints get lost in chat threads, and tenants have no visibility into their payment history or lease details. This project digitizes the entire workflow for three types of users: tenants, owners, and a platform admin.

👥 User Roles
🧑 Tenant
View assigned room and lease details
View and pay rent (mock payment flow)
View payment history
Raise and track complaints
View notices published by the owner
🧑‍💼 Owner
Add and manage properties
Add and manage rooms
Add tenants and assign them to rooms
Set monthly rent per room
Record and track payments
Manage and resolve complaints
Publish notices
View income and occupancy analytics
🛡️ Admin
Manage owners and tenants platform-wide
View all properties
Block/unblock users
Monitor complaints across the platform
View platform-wide statistics
🖥️ Application Structure
                    PG MANAGEMENT SYSTEM
                           |
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          TENANT         OWNER          ADMIN
             |             |              |
             ↓             ↓              ↓
         Dashboard      Dashboard      Dashboard
             |             |              |
        ┌────┴────┐   ┌────┴─────┐    ┌──┴───┐
        ↓         ↓   ↓          ↓    ↓      ↓
      Rent    Complaint Property  Tenant Users Reports
        ↓         ↓   ↓          ↓
     Payment    Status Rooms    Payments
🚀 Core Features
🏢 Property Management

Owners can manage multiple properties, each with its own location and set of rooms.

Owner: Rahul
  ├── Green Valley PG (Sonipat) — 25 rooms
  └── Student Homes (Delhi) — 40 rooms
🚪 Room Management

Each property contains rooms with capacity, occupancy, and rent tracked individually.

Room	Capacity	Occupied	Rent
101	2	2	₹8,000
102	2	1	₹8,000
103	3	0	₹7,000

Owners get a live occupancy summary:

Total Rooms       25
Occupied Rooms    20
Available Rooms    5
Occupancy         80%
👨‍🎓 Tenant Management

Owners can add, edit, remove, and reassign tenants — including full lease details (joining date, lease end, assigned room, monthly rent).

💰 Rent Management

The system auto-generates a monthly rent record per tenant and tracks payment status (Paid / Pending) over time.

Owner Dashboard
Total Rent Expected     ₹2,00,000
Rent Collected          ₹1,72,000
Pending Rent             ₹28,000
💳 Payment System (Mock)

V1 uses a simulated payment flow (UPI / Card / Cash) that generates a transaction ID and receipt — no real money movement. A real payment gateway can be integrated later.

🔧 Complaint Management

Tenants raise complaints by category, title, description, and priority. Owners track and update status through a defined lifecycle:

Pending → Assigned → In Progress → Resolved

Tenants can see live status and who it's assigned to.

📢 Notice System

Owners publish notices (e.g. water supply interruptions) visible to all tenants in that property.

📊 Owner Dashboard

An analytics view showing properties, occupancy, revenue trends, and complaint stats — built with charting (e.g. Recharts) for monthly revenue and occupancy visualizations.

👤 Tenant Dashboard

A simplified view showing the tenant's room, rent status, complaint history, and notices.

🛠️ Tech Stack
Frontend	(add: React / vanilla JS, etc.)
Backend	Node.js, Express.js
ORM	Prisma
Database	PostgreSQL







This is currently a college/academic project. Suggestions and issues are welcome via GitHub Issues.
