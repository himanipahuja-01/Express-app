const port = 2701;
const express = require("express");
const app = express();
const myrouter = require("./route");
const mysession = require("express-session");

app.set("view engine", "ejs");

app.use(
  mysession({
    secret: "Email_id",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(
  mysession({
    secret: "user_name",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(
  mysession({
    secret: "Admin_email",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(
  mysession({
    secret: "Admin_password",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", myrouter);
app.use("/about", myrouter);
app.use("/Add_product", myrouter);
app.use("/add_now", myrouter);
app.use("/display_product", myrouter);
app.use("/search_product", myrouter);
app.use("/find_record", myrouter);
app.use("/add_stu", myrouter);
app.use("/add_student_data", myrouter);
app.use("/display_students", myrouter);
app.use("/delete_student", myrouter);
app.use("/task_students", myrouter);
app.use("/file_download", myrouter);
app.use("/show_watches", myrouter);
app.use("/add_watches", myrouter);
app.use("/display_watches", myrouter);
app.use("/view/:id", myrouter);
app.use("/mybill_details", myrouter);
// app.use('/product_success',myrouter)
// app.use('/product_cancel',myrouter)
app.use("/Payment_success", myrouter);
app.use("/Payment_cancel", myrouter);
app.use("/callback", myrouter);
app.use("/pay_now", myrouter);
app.use("/newuser", myrouter);
app.use("/save_newuser", myrouter);
app.use("/login_check", myrouter);
app.use("/logout", myrouter);
app.use("/admin", myrouter);
app.use("/admin_signup", myrouter);
app.use("/admin_login_check", myrouter);
app.use("/products_show", myrouter);
app.use("/delete_product", myrouter);
app.use("/edit_product", myrouter);
app.use("/edited_watch", myrouter);
app.use("/show_users", myrouter);
app.use("/edit_user", myrouter);
app.use("/delete_user", myrouter);
app.use("/edited_user", myrouter);
app.use("/order_list", myrouter);
app.use("/payment", myrouter);
app.use("/shipping", myrouter);
app.use("/cancel_order", myrouter);
app.use("/edit_shipping", myrouter);
app.use("/edited_shipping", myrouter);
app.use("/myorder", myrouter);
app.use("/shipping_st", myrouter);
// app.use("/welcome_dashboard", myrouter);

// app.use('/callback/:productid/:productname',myrouter)

app.use("/public", express.static(__dirname + "/public"));
// console.log(__dirname)

app.listen(port, () => {
  console.log("License under Himani....");
  console.log(`http://localhost:${port}`);
});
