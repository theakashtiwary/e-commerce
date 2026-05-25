# 

## **Context and Role**

You are expected to develop a modern full stack e commerce application that can realistically be used as a real world shopping platform, not just a basic academic project.

The main goal is to make the shopping process simple and smooth for users. Customers should be able to browse products comfortably, search for items quickly, apply filters, manage their shopping cart, and complete checkout without confusion.

The platform should also remain responsive across different screen sizes and provide a clean user experience on desktop, tablet, and mobile devices.

From the backend side, the application must securely process customer orders, store data properly, and send confirmation emails whenever an order is placed successfully.

---

# **Objective**

The project should include the following core features:

### **1\. Product Catalog**

* Category based filtering  
* Keyword search functionality  
* Price range filtering

### **2\. Shopping Cart**

* Add products to cart  
* Remove products from cart  
* Update product quantities dynamically

### **3\. Multi Step Checkout**

* Shipping information section  
* Order summary review  
* Confirmation step before final order placement

### **4\. Form Validation**

* Frontend validation  
* Backend validation

### **5\. Order Management**

* Secure order storage  
* Unique order ID generation  
* Timestamp tracking

### **6\. Email Notifications**

* Confirmation email to customer  
* Notification email to admin/store owner

### **7\. Error Handling**

* Frontend error feedback  
* Backend validation responses  
* User friendly messages

---

# **Animation Requirements**

## **Page Structure**

### **Homepage**

* Hero section  
* Featured products  
* Category shortcut cards

### **Product Listing Page**

* Search functionality  
* Category filtering  
* Sorting options

### **Product Detail Page**

* Product gallery/images  
* Stock availability status  
* Product details  
* Add to Cart button

### **Cart Page**

* Selected products list  
* Quantity management  
* Pricing breakdown  
* Total amount calculation

### **Checkout Page**

* Customer information form  
* Order summary section

### **Order Confirmation Page**

* Successful order details  
* Generated order ID display

---

# **UI/UX Guidelines**

1. Maintain consistent layout spacing, typography, and color balance.  
2. Add hover effects, focus states, and interactive feedback.  
3. Product cards should display:  
   * Product image  
   * Product title  
   * Product price  
   * Quick Add to Cart button  
4. Cart icon in the navbar should update dynamically.  
5. Use skeleton loaders or lightweight placeholders during data fetching.  
6. Display toast notifications for:  
   * Adding products  
   * Removing products  
   * Successful order placement  
7. Display meaningful empty states instead of blank screens.

---

# **Animation Guidelines**

Animations should enhance usability without affecting performance.

### **Recommended Animations**

1. Fade in product cards while loading  
2. Slide in cart sidebar from the right  
3. Animate quantity counters on updates  
4. Smooth route/page transitions  
5. Loading animations during API requests  
6. Use GPU friendly animations:  
   * transform  
   * opacity

---

# **Layout Requirements**

1. Fully responsive design for:  
   * Mobile  
   * Tablet  
   * Desktop  
2. Accessibility support using:  
   * Semantic HTML  
   * ARIA labels  
   * Keyboard navigation  
3. Shared Header should include:  
   * Logo  
   * Navigation links  
   * Search bar  
   * Cart icon  
4. Footer should contain:  
   * Policy links  
   * Contact details  
   * Social media links

---

# **Checkout System Requirements**

## **Checkout Flow**

### **Step 1: Cart Review**

Users verify selected products and pricing.

### **Step 2: Customer Details**

Collect shipping and contact information.

### **Step 3: Final Order Summary**

Display final review before confirmation.

### **Step 4: Order Confirmation**

Show successful order details with generated order ID.

---

# **Checkout Form Fields**

1. Full Name  
2. Email Address  
   * Proper email validation required  
3. Phone Number  
   * Digit validation required  
4. Street Address  
5. City  
6. State  
7. Postal Code  
8. Payment Method Selection  
9. Optional Order Notes

---

# **Validation Requirements**

1. Show inline validation while users type.  
2. Prevent invalid form submission.  
3. Revalidate all data on backend before saving.  
4. Return clear success and error responses.

---

# **Backend Requirements**

# **API Endpoints**

### **Product APIs**

#### **GET `/api/products`**

Fetch products with filtering support.

#### **GET `/api/products/:id`**

Fetch detailed product information.

### **Order APIs**

#### **POST `/api/orders`**

Validate and save customer orders.

#### **GET `/api/orders/:id`**

Retrieve order details using order ID.

---

# **Order Processing Requirements**

1. Generate unique order IDs.  
2. Store order statuses:  
   * Pending  
   * Confirmed  
   * Shipped  
   * Delivered  
3. Save timestamps for tracking.  
4. Return structured JSON responses.

---

# **Email Notification System**

After successful order placement, send confirmation emails containing:

1. Customer name and email  
2. Unique order ID  
3. Order timestamp  
4. Purchased products list  
5. Product quantity and pricing  
6. Shipping address  
7. Final order amount

### **Email Technologies**

* Nodemailer  
* SMTP  
* SendGrid  
* Mailgun

### **Additional Requirements**

* Send emails to both customer and admin  
* Store credentials securely inside `.env`

---

# **Rate Limiting and Spam Prevention**

1. Apply rate limiting on order APIs.  
2. Return HTTP `429` for excessive requests.  
3. Optional Google reCAPTCHA v3 integration.

---

# **Database Requirements**

## **Supported Databases**

* MongoDB with Mongoose  
* PostgreSQL with Prisma ORM

---

# **Product Schema Fields**

* id  
* name  
* description  
* category  
* stock  
* imageUrl  
* createdAt

---

# **Order Schema Fields**

* orderId  
* customer details  
* ordered items  
* total amount  
* order status  
* timestamps

---

# **Security Requirements**

1. Sanitize incoming user input.  
2. Use `helmet.js` for secure headers.  
3. Validate request bodies before processing.  
4. Keep credentials inside `.env`.  
5. Configure CORS properly.  
6. Avoid exposing internal server errors.

---

# **Output Requirements**

1. Functional product listing page  
2. Filtering and live search support  
3. Persistent shopping cart  
4. Validated checkout workflow  
5. Unique order IDs  
6. Confirmation email system  
7. Order confirmation page  
8. Proper API error handling

---

# **Error Handling**

## **Frontend**

* Show validation errors below inputs  
* Display fallback UI during failures

## **Backend**

* Return descriptive validation responses  
* Use logging tools:  
  * morgan  
  * winston

---

# **Documentation Requirements**

Document the following clearly:

1. Folder structure overview  
2. Local setup instructions  
3. Environment variables explanation  
4. Database seeding steps  
5. Deployment process

---

# **Performance Optimization**

1. Lazy load images  
2. Use dynamic imports  
3. Debounce search requests  
4. Cache frequently requested data  
5. Remove unused libraries  
6. Use optimized image formats like WebP

---

# **SEO Requirements**

1. Add unique page titles  
2. Add meta descriptions  
3. Use semantic HTML  
4. Add Open Graph tags  
5. Keep routes crawlable

---

# **Accessibility Requirements**

1. Add descriptive alt text  
2. Associate labels with inputs  
3. Use accessible button names  
4. Maintain proper color contrast  
5. Support complete keyboard navigation

---

# **Technology Stack**

## **Frontend**

1. React  
2. Tailwind CSS  
3. Framer Motion or CSS transitions  
4. React Context API or Zustand  
5. Axios or Fetch API

---

## **Backend**

1. Node.js with Express  
2. Nodemailer  
3. express-validator  
4. helmet.js  
5. express-rate-limit  
6. dotenv  
7. morgan or winston

---

# **Database**

1. MongoDB with Mongoose

OR

2. PostgreSQL with Prisma ORM

---

# **Optional Technologies**

1. Redis for caching  
2. Cloudinary for image hosting  
3. SendGrid or Mailgun for email delivery  
4. Google reCAPTCHA v3 for spam prevention

