# 🎓 UniDesk

> A centralized, web-based platform engineered to revolutionize the grievance redressal lifecycle in educational institutions.

## 🚀 Overview

UniDesk bridges the communication gap between students and institutional management. It empowers students to seamlessly submit, track, and manage complaints spanning campus facilities, academics, and administration, while equipping administrators with an intuitive dashboard to resolve issues with transparency, accountability, and speed.

---

## ✨ Key Value Propositions

### For Students:
* **Frictionless Submission:** Multi-category ticketing system for quick, structured reporting.
* **Real-Time Tracking:** Live status updates (*Pending*, *In Progress*, *Resolved*) with complete audit trails.
* **Direct Communication:** Secure messaging channels to interact with designated grievance officers.

### For Administrators:
* **Centralized Dashboard:** Comprehensive overview of incoming tickets, bottleneck departments, and resolution metrics.
* **Automated Routing:** Intelligent assignment of complaints to the appropriate department or authority based on category keywords.
* **Performance Analytics:** Data-driven insights to measure response times and improve overall institutional efficiency.

---

## 🗂️ System Architecture & Tech Stack

* **Frontend:** Next.js, Tailwind CSS, Shadcn UI
* **Backend:** Node.js, NestJS, Socket.io (Real-time updates)
* **Database:** PostgreSQL managed via Prisma ORM
* **Storage:** AWS S3 / Cloudinary for attachments
* **Authentication:** JWT / Role-Based Access Control (RBAC)

---

## ⚙️ Getting Started (Local Development)

Follow these steps to set up the project locally on your machine.

### Prerequisites
* Node.js (v18+ recommended)
* PostgreSQL installed and running locally or via a cloud provider (e.g., Neon, Supabase)
* Git

### 1. Clone the Repository
git clone [https://github.com/your-username/unidesk.git](https://github.com/ykankitsingh/unidesk.git)
cd unidesk
