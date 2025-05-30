# Blood Donation Application

**Assignment Category:** assignment12_category_001

---

## 📽️ Requirement Explanation Video  
(Include your video link here if available)

---

## 1. Objective  
The Blood Donation Application is designed to provide a seamless platform for connecting blood donors with recipients in need. Built on the MERN stack (MongoDB, Express.js, React, Node.js), the app includes user registration, donation requests, donor management, content/blog management, and role-based access control.

---

## 2. Admin Credentials  
- **Admin Email:** shuvohowlader10@gmail.com 
- **Admin Password:** shuvohowlader10@gmail.comS 



---

## 3. Live Site  
[Live Site URL](https://blood-donate-fdae5.web.app/)  

---

## 4. Features

- Responsive design optimized for mobile, tablet, and desktop devices, including dashboard layouts.
- Role-based user access with three roles: Admin, Donor, and Volunteer.
- User registration with blood group, district, and upazila selection (no social login).
- Secure authentication with JWT tokens stored in localStorage.
- Dashboard with profile management and editable user details.
- Donor dashboard shows recent and paginated donation requests with full CRUD operations.
- Admin dashboard with user management (block/unblock, role changes), donation requests overview, and content/blog management.
- Volunteer dashboard with limited permission focusing on updating donation statuses and content management.
- Rich text editor for blog creation (using jodit-react) with publish/unpublish features controlled by admin.
- Sweet alerts/toasts for all CRUD operations and authentication actions instead of default alerts.
- Data fetching powered by TanStack Query for GET requests.
- Environment variables used to hide Firebase and MongoDB credentials.
- Pagination and filtering on user lists, donation requests, and blog content.
- Donation request flow includes status updates: pending → inprogress → done/canceled.
- Contact us form and donation funding integration with Stripe (bonus).
- Search page for donors filtering by blood group, district, and upazila.
- JWT-protected private routes with page reload persistence.
- User status management allowing blocking users by admin.
- Bonus: Charts for donations and funding overview, PDF export, animations (optional).

---



## 6. Resources Used  

- Bangladesh district and upazila data from [Bangladesh Geocode Repository](https://github.com/nuhil/bangladesh-geocode).
- Image uploads handled via ImageBB.
- React rich text editor: jodit-react.
- Sweetalert2 for user notifications.
- Stripe for payment integration.



