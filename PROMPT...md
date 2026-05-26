 # Context and Role

You are responsible for developing a modern full stack e commerce platform that can function like a real world shopping application instead of a simple academic project.

The primary objective is to create a smooth and user friendly shopping experience where customers can browse products easily, search items quickly, apply filters, manage their shopping cart efficiently, and complete checkout without confusion.

The application must maintain a responsive and visually balanced interface across desktop, tablet, and mobile devices.

From the backend perspective, the platform should securely process customer orders, store data properly, manage order tracking, and send confirmation emails whenever an order is placed successfully.

The entire system should feel realistic, optimized, scalable, and production ready while maintaining clean UI interactions and smooth user experience.

 Objective

Develop a complete full stack e commerce application that includes the following functionalities:

1. Product catalog management with category filtering and keyword search.
2. Dynamic shopping cart functionality.
3. Multi step checkout workflow.
4. Secure backend order processing.
5. Responsive and accessible UI design.
6. Email notifications for customers and admin.
7. Proper frontend and backend validation.
8. Smooth animations and interactive transitions.
9. Performance optimization and SEO improvements.
10. Production ready folder structure and deployment support.

 UI and Animation Requirements

 Scroll Based User Experience

The application should provide smooth visual interactions that improve usability without reducing performance.

 Required Animation Features

1. Fade in product cards during loading.
2. Smooth hover interactions on buttons and cards.
3. Animated cart sidebar transition.
4. Smooth page and route transitions.
5. Animated quantity updates inside cart.
6. Loading animations during API requests.
7. Interactive feedback for cart and checkout actions.

 Animation Optimization Rules

Animations must:

1. Remain lightweight and responsive.
2. Avoid layout thrashing.
3. Use GPU friendly properties such as transform and opacity.
4. Maintain smooth scrolling performance.
5. Work efficiently across all screen sizes.

 Layout Requirements

The application must include the following sections and pages:

 Homepage

1. Hero section with promotional content.
2. Featured products section.
3. Category shortcut cards.
4. Trending products section.
5. Newsletter or promotional banner.

 Product Listing Page

1. Product search functionality.
2. Category based filtering.
3. Price range filtering.
4. Sorting options.
5. Product grid layout.

 Product Detail Page

1. Product image gallery.
2. Product information section.
3. Product pricing.
4. Stock availability display.
5. Add to Cart functionality.
6. Related product suggestions.

 Cart Page

1. Selected product list.
2. Quantity management.
3. Product removal functionality.
4. Pricing breakdown.
5. Total amount calculation.

 Checkout Page

1. Customer information form.
2. Shipping information section.
3. Payment method selection.
4. Final order summary.
5. Confirmation step before order placement.

 Order Confirmation Page

1. Successful order details.
2. Generated order ID.
3. Purchased product summary.
4. Delivery information.

 Responsive and Accessibility Requirements

The platform must:

1. Support mobile devices.
2. Support tablets.
3. Support desktop screens.
4. Use semantic HTML.
5. Include ARIA labels.
6. Support complete keyboard navigation.
7. Maintain proper color contrast.
8. Include descriptive alt text.
9. Use accessible button names.
10. Maintain clean typography and spacing.

 Shared Header Requirements

The shared navigation header must include:

1. Brand logo.
2. Navigation links.
3. Product search bar.
4. Shopping cart icon.
5. Dynamic cart item counter.

 Footer Requirements

The footer should contain:

1. Policy links.
2. Contact information.
3. Social media links.
4. Copyright details.

 Product Catalog Requirements

The product catalog system must support:

1. Category based filtering.
2. Keyword search functionality.
3. Price range filtering.
4. Product sorting.
5. Dynamic product loading.
6. Responsive product cards.

 Product Card Requirements

Each product card should display:

1. Product image.
2. Product title.
3. Product price.
4. Short description.
5. Quick Add to Cart button.
6. Hover interaction effects.

 Shopping Cart Requirements

The shopping cart system must allow users to:

1. Add products to cart.
2. Remove products from cart.
3. Update quantities dynamically.
4. Persist cart data.
5. View pricing breakdown.
6. View final amount.

Checkout System Requirements

 Checkout Flow

 Step 1 Cart Review

Users should verify selected products and pricing.

 Step 2 Customer Information

Collect shipping and contact information.

 Step 3 Final Order Summary

Display complete order details before confirmation.

 Step 4 Order Confirmation

Show successful order information with generated order ID.

Checkout Form Fields

The checkout form must include:

1. Full Name
2. Email Address
3. Phone Number
4. Street Address
5. City
6. State
7. Postal Code
8. Payment Method
9. Optional Order Notes

Validation Requirements

The application must:

1. Validate data on frontend.
2. Revalidate data on backend.
3. Show inline validation messages.
4. Prevent invalid form submission.
5. Validate email format correctly.
6. Validate phone number properly.
7. Return clear success responses.
8. Return descriptive error responses.

 Backend Requirements

 API Endpoints

 Product APIs

1. GET api products for fetching product lists.
2. GET api products id for fetching product details.

 Order APIs

1. POST api orders for creating customer orders.
2. GET api orders id for retrieving order details.

 Order Processing Requirements

The backend system must

1. Generate unique order IDs.
2. Store customer order information securely.
3. Save timestamps for order tracking.
4. Maintain order statuses.
5. Return structured JSON responses.
6. Handle backend validation properly.

Order Status Types

1. Pending
2. Confirmed
3. Shipped
4. Delivered

 Database Requirements

Supported database options:

1. MongoDB with Mongoose.
2. PostgreSQL with Prisma ORM.

 Product Schema Fields

The product schema should include:

1. id
2. name
3. description
4. category
5. stock
6. imageUrl
7. createdAt

Order Schema Fields

The order schema should include:

1. orderId
2. customer details
3. ordered items
4. total amount
5. order status
6. timestamps

 Email Notification System

After successful order placement, the system must send emails containing:

1. Customer name.
2. Customer email.
3. Unique order ID.
4. Order timestamp.
5. Purchased product details.
6. Product quantity.
7. Product pricing.
8. Shipping address.
9. Final order amount.

 Email Requirements

1. Send confirmation email to customer.
2. Send notification email to admin.
3. Store email credentials securely using environment variables.
4. Handle email delivery failures gracefully.

Supported Email Technologies

1. Nodemailer
2. SMTP
3. SendGrid
4. Mailgun

 Security Requirements

The application must:

1. Sanitize incoming user input.
2. Prevent XSS attacks.
3. Prevent injection attacks.
4. Use helmet js for secure headers.
5. Validate request bodies before processing.
6. Configure CORS properly.
7. Keep credentials inside environment variables.
8. Avoid exposing internal server errors.

 Rate Limiting and Spam Prevention

The backend system must:

1. Apply rate limiting on APIs.
2. Return HTTP 429 for excessive requests.
3. Support optional Google reCAPTCHA v3 integration.

Data Processing Requirements

The backend should:

1. Validate all incoming data.
2. Sanitize all user input.
3. Store order information securely.
4. Return structured API responses.
5. Log backend failures properly.

 JSON Response Requirements

 Success Response

The API should return a success message after successful order creation.

 Error Response

The API should return descriptive validation and processing errors.

 UI and User Experience Guidelines

The application should:

1. Maintain consistent spacing and typography.
2. Provide interactive hover feedback.
3. Display meaningful empty states.
4. Use lightweight loading placeholders.
5. Show toast notifications for actions.
6. Maintain smooth navigation flow.

 Toast Notification Requirements

Display notifications for:

1. Adding products to cart.
2. Removing products from cart.
3. Successful order placement.
4. Validation errors.
5. Backend failures.

 Performance and Scalability

The application must:

1. Optimize bundle size.
2. Lazy load images.
3. Use dynamic imports.
4. Debounce search requests.
5. Cache frequently requested data.
6. Remove unused libraries.
7. Use optimized image formats.
8. Support high traffic.
9. Avoid API bottlenecks.
10. Maintain animation performance.

 SEO Requirements

The application should:

1. Add unique page titles.
2. Add meta descriptions.
3. Use semantic HTML.
4. Include Open Graph tags.
5. Keep routes crawlable.

 Error Handling Requirements

 Frontend Error Handling

The frontend must:

1. Show validation messages below inputs.
2. Display fallback UI during failures.
3. Handle empty states properly.
4. Show meaningful user feedback.

 Backend Error Handling

The backend must:

1. Return descriptive validation responses.
2. Log backend failures.
3. Handle database failures properly.
4. Handle email delivery failures gracefully.
5. Return proper HTTP status codes.

Logging Requirements

Recommended logging tools:

1. Morgan
2. Winston

 Documentation Requirements

Document the following clearly:

1. Folder structure overview.
2. Local setup instructions.
3. Environment variable configuration.
4. Database setup process.
5. Database seeding steps.
6. Deployment instructions.
7. API endpoint documentation.

Output Requirements

The final application must provide:

1. Functional product listing page.
2. Product filtering support.
3. Live product search.
4. Persistent shopping cart.
5. Secure checkout workflow.
6. Unique order ID generation.
7. Confirmation email system.
8. Order confirmation page.
9. Proper API error handling.
10. Responsive and accessible design.
11. Smooth user interactions.
12. Production ready architecture.

 Technology Stack

Frontend Technologies

1. React
2. Tailwind CSS
3. Framer Motion or CSS transitions
4. React Context API or Zustand
5. Axios or Fetch API

 Backend Technologies

1. Node js with Express
2. Nodemailer
3. express validator
4. helmet js
5. express rate limit
6. dotenv
7. Morgan or Winston

 Database Technologies

1. MongoDB with Mongoose
   OR
2. PostgreSQL with Prisma ORM

Optional Technologies

1. Redis for caching.
2. Cloudinary for image hosting.
3. SendGrid or Mailgun for email delivery.
4. Google reCAPTCHA v3 for spam prevention.


