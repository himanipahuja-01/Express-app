const express = require("express");
const app = express();
// const mypaytm = require('./Paytm')

const https = require("https");

const bodyparser = require("body-parser");
const router = express.Router();

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const qs = require("querystring");

const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");

const myconnection = require("./mydatabase_connectivity");

const url_encode = bodyparser.urlencoded({ extended: false });
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const e = require("express");

var storage = multer.diskStorage({
  destination: "./public/upload_images",
  filename: (req, file, st) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) {
        return st(err);
      } else {
        st(null, raw.toString("hex") + path.extname(file.originalname));
      }
    });
  },
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("login", { msg: 0 });
  res.end();
});
router.get("/about", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("about");
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/Add_product", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("product", { mymessage: 0 });
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/add_now", url_encode, (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    p_name = req.body.pname;
    p_price = req.body.pprice;
    p_type = req.body.ptype;
    p_n_stock = req.body.nstock;

    myconnection.getConnection((err, myconnect) => {
      if (err) {
        myconnect.release();
        res.send(err);
        res.end();
      } else {
        q = `insert into product(product_name,product_price,product_type,no_of_stock)values('${p_name}','${p_price}','${p_type}','${p_n_stock}')`;
        myconnect.query(q, (err) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            res.render("product", { mymessage: "Product added " + p_name });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/display_product", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "select * from product";
        myconnect.query(q, (err, result) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("display", { mydata: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/search_product", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("search_record", { status: 0, status1: 0, mydata: 0 });
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/find_record", url_encode, (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    var search_value = req.body.ps;
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var myquery = `select * from product where product_name='${search_value}' or product_type='${search_value}' or product_price='${search_value}'`;
        myconnect.query(myquery, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else if (result.length > 0) {
            res.render("search_record", {
              status: 0,
              status1: 1,
              mydata: result,
            });
            res.end();
          } else {
            res.render("search_record", { status: 1, status1: 0, mydata: 0 });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/add_stu", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("add_student", { status: 0 });
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.post(
  "/add_student_data",
  url_encode,
  upload.single("my_image_file"),
  (req, res) => {
    // console.log(req.file.filename)
    if (req.session.Email_id != null && req.session.user_name != 0) {
      s_name = req.body.nm;
      s_id = req.body.em;
      s_image = req.file.filename;
      s_branch = req.body.brn;

      myconnection.getConnection((err, myconnect) => {
        if (err) {
          myconnect.release();
          res.send(err);
          res.end();
        } else {
          q = `insert into student(name,email_id,student_image,branch)values('${s_name}','${s_id}','${s_image}','${s_branch}')`;
          myconnect.query(q, (err) => {
            if (err) {
              myconnect.release();
              res.send(err);
              res.end();
            } else {
              res.render("add_student", { status: 1 });
              res.end();
            }
          });
        }
      });
    } else {
      res.render("Login", { msg: "Login here.." });
      res.end();
    }
  }
);

router.get("/display_students", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "select * from student";
        myconnect.query(q, (err, result) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("display_stu", { mydata: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/delete_student", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    // console.log(req.query)
    var student_email = req.query.chd;
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "delete from student where email_id='" + student_email + "'";
        myconnect.query(q, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var q1 = "select * from student";
            myconnect.query(q1, (err, result) => {
              if (err) {
                res.send(err);
                res.end;
              } else {
                res.render("display_stu", { status: 0, mydata: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/task_students", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "select * from student";
        myconnect.query(q, (err, result) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("task", { status: 0, mydata: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.post(
  "/add_stu_data",
  url_encode,
  upload.single("my_image_file"),
  (req, res) => {
    if (req.session.Email_id != null && req.session.user_name != 0) {
      // console.log(req.file.filename)
      s_name = req.body.nm;
      s_id = req.body.em;
      s_image = req.file.filename;
      s_branch = req.body.brn;

      myconnection.getConnection((err, myconnect) => {
        if (err) {
          myconnect.release();
          res.send(err);
          res.end();
        } else {
          q = `insert into student(name,email_id,student_image,branch)values('${s_name}','${s_id}','${s_image}','${s_branch}')`;
          myconnect.query(q, (err) => {
            if (err) {
              myconnect.release();
              res.send(err);
              res.end();
            } else {
              var q = "select * from student";
              myconnect.query(q, (err, result) => {
                if (err) {
                  myconnect.release();
                  res.send(err);
                  res.end();
                } else {
                  myconnect.release();
                  res.render("task", { status: 1, mydata: result });
                  res.end();
                }
              });
            }
          });
        }
      });
    } else {
      res.render("Login", { msg: "Login here.." });
      res.end();
    }
  }
);

router.get("/delete_stu", (req, res) => {
  // console.log(req.query)
  if (req.session.Email_id != null && req.session.user_name != 0) {
    var student_email = req.query.chd;
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "delete from student where email_id='" + student_email + "'";
        myconnect.query(q, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var q1 = "select * from student";
            myconnect.query(q1, (err, result) => {
              if (err) {
                res.send(err);
                res.end;
              } else {
                res.render("task", { status: 0, mydata: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/file_download", (req, res) => {
  myfilename = req.query.myfile;
  // console.log(__dirname)
  res.download(__dirname + "/public/upload_images/" + myfilename, (err) => {
    if (err) {
      res.send(err);
      res.end();
    }
  });
});

router.get("/display_watches", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = "select * from watch_products";
        myconnect.query(q, (err, result) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("display_watches", { status: 0, mydata: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/view/:id", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    // console.log(req.params.id)
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var q = `select * from watch_products where Product_id='${req.params.id}'`;
        myconnect.query(q, (err, result) => {
          if (err) {
            myconnect.release();
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("view_watch", { status: 0, mydata: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/mybill_details", url_encode, (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    var watch_name = req.body.watch_name;
    var watch_id = req.body.watch_id;
    var watch_price = req.body.watch_price;
    var watch_quantity = req.body.watch_quantity;
    var watch_type = req.body.watch_type;
    var watch_description = req.body.watch_description;

    var final_price = parseInt(watch_price) * watch_quantity;

    res.render("view_bill_details", {
      pname: watch_name,
      prid: watch_id,
      pprice: final_price,
      pqnty: watch_quantity,
      ptype: watch_type,
      description: watch_description,
    });
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

// router.get("/product_success", (req, res) => {
//   res.render("success_payment");
//   res.end();
// });

// router.get("/product_cancel", (req, res) => {
//   res.render("cancel_payment");
//   res.end();
// });

router.post("/pay_now", [parseUrl, parseJson], url_encode, (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    var description = req.body.description;
    var quantity = req.body.quantity;
    var productid = req.body.item_number;
    var productname = req.body.item_name;
    var amount = req.body.amount;

    // console.log(productid)

    // Route for making payment

    var paymentDetails = {
      amount: req.body.amount,
      customerId: "@himani_pahuja",
      customerEmail: "himanipahuja@gmail.com",
      customerPhone: "9888822658",
    };
    if (
      !paymentDetails.amount ||
      !paymentDetails.customerId ||
      !paymentDetails.customerEmail ||
      !paymentDetails.customerPhone
    ) {
      res.status(400).send("Payment failed");
    } else {
      var params = {};
      params.MID = config.PaytmConfig.mid;
      params["WEBSITE"] = config.PaytmConfig.website;
      params["CHANNEL_ID"] = "WEB";
      params["INDUSTRY_TYPE_ID"] = "Retail";
      params["ORDER_ID"] = "TEST_" + new Date().getTime();
      params["CUST_ID"] = paymentDetails.customerId;
      params["TXN_AMOUNT"] = paymentDetails.amount;
      params["CALLBACK_URL"] =
        "http://localhost:2701/callback/" +
        productid +
        "/" +
        productname +
        "/" +
        amount;
      params["EMAIL"] = paymentDetails.customerEmail;
      params["MOBILE_NO"] = paymentDetails.customerPhone;

      checksum_lib.genchecksum(
        params,
        config.PaytmConfig.key,
        function (err, checksum) {
          var txn_url =
            "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

          var form_fields = "";
          for (var x in params) {
            form_fields +=
              "<input type='hidden' name='" +
              x +
              "' value='" +
              params[x] +
              "' >";
          }
          form_fields +=
            "<input type='hidden' name='CHECKSUMHASH' value='" +
            checksum +
            "' >";

          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(
            '<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
              txn_url +
              '" name="f1">' +
              form_fields +
              '</form><script type="text/javascript">document.f1.submit();</script></body></html>'
          );
          res.end();
        }
      );
    }
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.use("/callback/:productid/:productname/:amount", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    // Route for verifiying payment

    var body = "";

    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      var html = "";
      var post_data = qs.parse(body);

      // received params in callback
      console.log("Callback Response: ", post_data, "\n");

      // verify the checksum
      var checksumhash = post_data.CHECKSUMHASH;

      // delete post_data.CHECKSUMHASH;
      var result = checksum_lib.verifychecksum(
        post_data,
        config.PaytmConfig.key,
        checksumhash
      );
      console.log("Checksum Result => ", result, "\n");

      // Send Server-to-Server request to verify Order Status
      var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

      checksum_lib.genchecksum(
        params,
        config.PaytmConfig.key,
        function (err, checksum) {
          params.CHECKSUMHASH = checksum;
          post_data = "JsonData=" + JSON.stringify(params);

          var options = {
            hostname: "securegw-stage.paytm.in", // for staging
            // hostname: 'securegw.paytm.in', // for production
            port: 443,
            path: "/merchant-status/getTxnStatus",
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": post_data.length,
            },
          };

          // Set up the request
          var response = "";
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              console.log("S2S Response: ", response, "\n");

              var _result = JSON.parse(response);
              if (_result.STATUS == "TXN_SUCCESS") {
                _result.CURRENCY = "INR";
                // console.log(_result);
                myconnection.getConnection((err, myconnect) => {
                  if (err) {
                    res.send(err);
                    res.end();
                  } else {
                    var query = `BEGIN;
                  insert into payment_mode values('${req.session.Email_id}','${_result.ORDERID}','${_result.MID}','${_result.TXNID}','${_result.TXNAMOUNT}','${_result.CURRENCY}','${_result.TXNDATE}','${_result.STATUS}','${_result.RESPCODE}','${_result.RESPMSG}','${_result.GATEWAYNAME}','${_result.BANKTXNID}','${_result.BANKNAME}','${_result.CHECKSUMHASH}','${_result.PAYMENTMODE}');

                  insert into shipping values('${req.session.Email_id}','${_result.ORDERID}','${req.params.productid}','${req.params.productname}','processing','processing','processing','chandigarh sector 34 a');

                  insert into my_order_list values('${req.session.Email_id}','${_result.ORDERID}','${req.params.productid}','${req.params.productname}','${req.params.amount}','${_result.TXNDATE}');
                  COMMIT;`;

                    myconnect.query(query, (err) => {
                      if (err) {
                        res.send(err);
                        res.end();
                      } else {
                        res.redirect("/Payment_success");
                        res.end();
                      }
                    });
                  }
                });
              } else {
                res.redirect("/Payment_cancel");
                res.end();
              }
            });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();
        }
      );
    });
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/Payment_success", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("success_payment");
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/Payment_cancel", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != 0) {
    res.render("cancel_payment");
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/newuser", (req, res) => {
  res.render("newuser", { msg: 0 });
  res.end();
});

router.post("/save_newuser", url_encode, (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var gender = req.body.gender;
  var mobile = req.body.mobile;
  var address = req.body.address;

  myconnection.getConnection((err, myconnect) => {
    if (err) {
      res.send(err);
      res.end();
    } else {
      var query = `insert into newuser(name,email,password,mobile,gender,address) values('${name}','${email}','${password}','${mobile}','${gender}','${address}')`;

      myconnect.query(query, (err) => {
        if (err) {
          res.send(err);
          res.end();
        } else {
          myconnect.release();
          res.render("newuser", { msg: "registration successfully" });
          res.end();
        }
      });
    }
  });
});

router.post("/login_check", url_encode, (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  myconnection.getConnection((err, myconnect) => {
    if (err) {
      res.send(err);
      res.end();
    } else {
      var query = `select * from newuser where email='${email}' and password='${password}'`;
      myconnect.query(query, (err, result) => {
        if (err) {
          res.send(err);
          res.end();
        } else {
          if (result.length > 0) {
            req.session.Email_id = email;
            req.session.user_name = result[0].name;
            res.redirect("/welcome_dashboard");
            res.end();
          } else {
            myconnect.release();
            res.render("login", { msg: "Invalid Login details" });
            res.end();
          }
        }
      });
    }
  });
});

router.get("/welcome_dashboard", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != null) {
    res.render("home", {
      Email: req.session.Email_id,
      Name: req.session.user_name,
    });
    res.end();
  } else {
    res.render("Login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("Login", { msg: "Logout successfully" });
  res.end();
});

router.get("/admin", (req, res) => {
  res.render("admin_login", { msg: 0 });
  res.end();
});

router.get("/admin_signup", (req, res) => {
  res.render("adminSignup");
  res.end();
});

router.post("/admin_login_check", url_encode, (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  myconnection.getConnection((err, myconnect) => {
    if (err) {
      res.send(err);
      res.end();
    } else {
      var query = `select * from admin_data where email_id='${email}' and password='${password}'`;

      myconnect.query(query, (err, result) => {
        if (err) {
          res.send(err);
          res.end();
        } else {
          if (result.length > 0) {
            req.session.Admin_email = email;
            req.session.password = password;
            myconnect.release();
            res.redirect("/admin_dashboard");
            res.end();
          } else {
            myconnect.release();
            res.render("admin_login", { msg: "Login here.." });
            res.end();
          }
        }
      });
    }
  });
});

router.get("/admin_dashboard", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
   
    res.render("admin_dash");
    res.end();
  } else {
 
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/products_show", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = "select * from watch_products";
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            // console.log(result)
            myconnect.release();
            res.render("product_show_admin", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/show_watches", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
   
    res.render("watches_add", { status: 0 });
    res.end();
  } else {

    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/add_watches", url_encode, upload.single("image"), (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    product_name = req.body.product_name;
    product_price = req.body.product_price;
    product_stock = req.body.product_stock;
    product_image = req.file.filename;
    product_type = req.body.product_type;
    product_description = req.body.product_description;

    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        data_query = `insert into watch_products(Product_price,Product_name,Product_description,Stock_availability,Product_type, Product_image)values('${product_price}','${product_name}','${product_description}','${product_stock}','${product_type}','${product_image}')`;

        myconnect.query(data_query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("watches_add", { status: 1 });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/delete_product", (req, res) => {
  // console.log(req.query.id)
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `delete from watch_products where Product_id='${req.query.id}'`;
        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = `select * from watch_products`;
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("product_show_admin", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/edit_product", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `select * from watch_products where Product_id = '${req.query.id}'`;
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            // console.log(result)
            myconnect.release();
            res.render("product_edit_admin", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/edited_watch", url_encode, (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    var id = parseInt(req.body.product_id);
    var name = req.body.product_name;
    var price = req.body.product_price;
    var stock = req.body.product_stock;
    var type = req.body.product_type;
    var description = req.body.product_description;

    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `update watch_products set Product_name='${name}',Product_price='${price}',Stock_availability='${stock}',Product_type='${type}',Product_description='${description}' where Product_id='${id}'`;

        // console.log(query)

        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = "select * from watch_products";
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("product_show_admin", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/show_users", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = "select * from newuser";
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("users", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/delete_user", (req, res) => {
  // console.log(req.query.id)
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `delete from newuser where email='${req.query.email}'`;
        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = `select * from newuser`;
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("users", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/edit_user", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `select * from newuser where email = '${req.query.email}'`;
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            // console.log(result)
            myconnect.release();
            res.render("user_edit", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/edited_user", url_encode, (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var gender = req.body.gender;
    var address = req.body.address;

    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `update newuser set name='${name}',email='${email}',password='${password}',mobile='${mobile}',gender='${gender}',address='${address}' where user_id='${id}'`;

        // console.log(query)

        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = "select * from newuser";
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("users", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/order_list", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = "select * from my_order_list";
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("order_list", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/payment", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = "select * from payment_mode";
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("payment_mode", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/shipping", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = "select * from shipping";
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            myconnect.release();
            res.render("shipping_status", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/cancel_order", (req, res) => {
  // console.log(req.query.id)
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `BEGIN;
        delete from payment_mode where orderid='${req.query.id}';

        delete from shipping where orderid='${req.query.id}';

        delete from my_order_list where orderid='${req.query.id}';
        COMMIT;`;
        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = `select * from my_order_list`;
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("order_list", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/edit_shipping", (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `select * from shipping where orderid = '${req.query.id}'`;
        myconnect.query(query, (err, result) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            // console.log(result)
            myconnect.release();
            res.render("shipping_edit", { data: result });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.post("/edited_shipping", url_encode, (req, res) => {
  if (req.session.Admin_email != null && req.session.password != null) {
    var id = req.body.id;
    var pid = req.body.pid;
    var name = req.body.name;
    var packing_status = req.body.packing_status;
    var shipping_status = req.body.shipping_status;
    var arrived_status = req.body.arrived_status;
    var address = req.body.address;

    myconnection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `update shipping set pname='${name}',pid='${pid}',packing_status='${packing_status}',shipping_status='${shipping_status}',arrived_status='${arrived_status}',shipping_address='${address}' where orderid='${id}'`;

        // console.log(query)

        myconnect.query(query, (err) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var query = "select * from shipping";
            myconnect.query(query, (err, result) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                myconnect.release();
                res.render("shipping_status", { data: result });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("admin_login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/myorder", (req, res) => {
  if (req.session.Email_id != null && req.session.user_name != null) {
    myconnection.getConnection((err, mydatabase) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `select * from my_order_list where ct_email_id='${req.session.Email_id}'`;
        mydatabase.query(query, (err, results) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            mydatabase.release();
            res.render("my_order_list", { data: results });
            res.end();
          }
        });
      }
    });
  } else {
    res.render("login", { msg: "Login here.." });
    res.end();
  }
});

router.get("/shipping_st", (req, res) => {
  var myorder_id = req.query.my_order_id;
  var order_price = req.query.price;
  var dt = req.query.dt;
  if (req.session.Email_id != null && req.session.user_name != null) {
    myconnection.getConnection((err, mydatabase) => {
      if (err) {
        res.send(err);
        res.end();
      } else {
        var query = `select * from shipping where ct_email_id='${req.session.Email_id}' and orderid='${myorder_id}'`;

        mydatabase.query(query, (err, results) => {
          if (err) {
            res.send(err);
            res.end();
          } else {
            var myproduct_id = results[0].pid;
            var query1 = `select * from watch_products where Product_id='${myproduct_id}'`;
            mydatabase.query(query1, (err, results) => {
              if (err) {
                res.send(err);
                res.end();
              } else {
                var myimage_url = results[0].Product_image;
                // console.log(results[0].pid)
                mydatabase.release();
                res.render("my_shipping_status", {
                  data: results,
                  date_time: dt,
                  price: order_price,
                  myimage: myimage_url,
                });
                res.end();
              }
            });
          }
        });
      }
    });
  } else {
    res.render("login", { msg: "Login here.." });
    res.end();
  }
});
module.exports = router;
