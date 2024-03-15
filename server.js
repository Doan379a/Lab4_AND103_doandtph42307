const express = require("express");
const mongoose = require("mongoose");
const spModel = require("./sanphamModal");
const FruitModel = require("./Fruit");

const app = express();
const port = 3000;
const uri =
  "mongodb+srv://doando:doantede@atlascluster.tuxgsuy.mongodb.net/md18309";

// Hàm kết nối MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
      // Thay useNewUrlParser bằng useUnifiedTopology và thêm các tùy chọn khác nếu cần
      useUnifiedTopology: true,
      // Thêm các tùy chọn khác nếu cần
    });
    console.log("Đã kết nối thành công đến MongoDB");
  } catch (error) {
    console.error("Lỗi khi kết nối đến MongoDB:", error);
  }
}

// Khi server được khởi động, kết nối đến MongoDB
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
  });
});

app.use(express.json()); // Sử dụng middleware để parse JSON

// app.get("/", async (req, res) => {
//   try {
//     let sanphams = await spModel.find();
//     console.log(sanphams);
//     res.send(sanphams);
//   } catch (error) {
//     console.error("Lỗi khi lấy dữ liệu từ MongoDB:", error);
//     res.status(500).send("Lỗi server");
//   }
// });

// app.get("/add_sp", async (req, res) => {
//   try {
//     await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
//     let sanpham = {
//       ten: "Sanpham 4",
//       gia: 500,
//       soluong: 10,
//       tonkho: false,
//     };
//     let kq = await spModel.create(sanpham);
//     console.log(kq);
//     let sanphams = await spModel.find();
//     res.send(sanphams);
//   } catch (error) {
//     console.error("Lỗi khi thêm sản phẩm:", error);
//     res.status(500).send("Lỗi server");
//   }
// });

app.get("/fruits", async (req, res) => {
  try {
    await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
    let kq = await FruitModel.find();
    console.log(kq);
    res.send(kq);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trái cây:", error);
    res.status(500).send("Lỗi server");
  }
});

// Phương thức lấy danh sách trái cây
app.get("/get-list-fruit", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  let payload;
  JWT.verify(token, SECRETKEY, (err, _payload) => {
    if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
    if (err) return res.sendStatus(403);
    payload = _payload;
  });
  console.log(payload);
  try {
    // await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
    const data = await FruitModel.find().populate("id_distributor");
    res.json({
      status: 200,
      message: "Lấy danh sách trái cây thành công",
      data: data,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trái cây:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: [],
    });
  }
});

// // Phương thức thêm trái cây
// app.post("/add-fruits", async (req, res) => {
//   try {
//     await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
//     const data = req.body;
//     const newFruit = new FruitModel({
//       name: data.name,
//       quantity: data.quantity,
//       price: data.price,
//       status: data.status,
//       image: data.image,
//       description: data.description,
//       id_distributor: data.id_distributor,
//     });
//     const result = await newFruit.save();
//     if (result) {
//       res.json({
//         status: 200,
//         message: "Thêm thành công",
//         data: result,
//       });
//     } else {
//       res.status(400).json({
//         status: 400,
//         message: "Lỗi, thêm không thành công",
//         data: [],
//       });
//     }
//   } catch (error) {
//     console.error("Lỗi khi thêm trái cây:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Lỗi server",
//       data: [],
//     });
//   }
// });

// // Phương thức lấy thông tin trái cây theo ID
// app.get("/get-fruit-by-id/:id", async (req, res) => {
//   try {
//     await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
//     const { id } = req.params;
//     const data = await FruitModel.findById(id).populate("id_distributor");
//     if (data) {
//       res.json({
//         status: 200,
//         message: "Lấy thông tin trái cây thành công",
//         data: data,
//       });
//     } else {
//       res.status(404).json({
//         status: 404,
//         message: "Không tìm thấy trái cây",
//         data: null,
//       });
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin trái cây theo ID:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Lỗi server",
//       data: null,
//     });
//   }
// });

// // Phương thức cập nhật trái cây theo ID
// app.put("/update-fruit-by-id/:id", async (req, res) => {
//   try {
//     await connectToMongoDB(); // Kết nối lại MongoDB trước khi thực hiện thao tác
//     const { id } = req.params;
//     const data = req.body;
//     const updateFruit = await FruitModel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     if (updateFruit) {
//       res.json({
//         status: 200,
//         message: "Cập nhật trái cây thành công",
//         data: updateFruit,
//       });
//     } else {
//       res.status(404).json({
//         status: 404,
//         message: "Không tìm thấy trái cây",
//         data: null,
//       });
//     }
//   } catch (error) {
//     console.error("Lỗi khi cập nhật thông tin trái cây:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Lỗi server",
//       data: null,
//     });
//   }
// });

// // Phương thức lấy danh sách trái cây trong một khoảng giá
// app.get("/get-list-fruit-in-price", async (req, res) => {
//   try {
//     const { price_start, price_end } = req.query;
//     const query = { price: { $gte: price_start, $lte: price_end } };
//     const data = await FruitModel.find(query)
//       .select("name quantity price id_distributor")
//       .populate("id_distributor")
//       .sort({ quantity: -1 })
//       .limit(2);

//     res.json({
//       status: 200,
//       message: "Danh sách trái cây",
//       data: data,
//     });
//   } catch (error) {
//     console.error(
//       "Lỗi khi lấy danh sách trái cây trong một khoảng giá:",
//       error
//     );
//     res.status(500).json({
//       status: 500,
//       message: "Lỗi server",
//       data: null,
//     });
//   }
// });

// // Phương thức lấy danh sách trái cây có chứa ký tự 'T' hoặc 'X' trong tên
// app.get("/get-list-fruit-have-a-or-x", async (req, res) => {
//   try {
//     const query = {
//       $or: [{ name: { $regex: "T" } }, { name: { $regex: "X" } }],
//     };
//     const data = await FruitModel.find(query)
//       .select("name quantity price id_distributor")
//       .populate("id_distributor");

//     res.json({
//       status: 200,
//       message: "Danh sách trái cây",
//       data: data,
//     });
//   } catch (error) {
//     console.error(
//       "Lỗi khi lấy danh sách trái cây có chứa ký tự 'T' hoặc 'X' trong tên:",
//       error
//     );
//     res.status(500).json({
//       status: 500,
//       message: "Lỗi server",
//       data: null,
//     });
//   }
// });
// Phương thức xóa trái cây theo ID
app.delete("/delete-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFruit = await FruitModel.findByIdAndDelete(id);
    if (deletedFruit) {
      res.json({
        status: 200,
        message: "Xóa trái cây thành công",
        data: deletedFruit,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Không tìm thấy trái cây",
        data: null,
      });
    }
  } catch (error) {
    console.error("Lỗi khi xóa trái cây:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: null,
    });
  }
});

///upload anh
const Upload = require("./config/common/upload");
// Phương thức thêm trái cây với tệp hình ảnh
app.post(
  "/add-fruit-with-file-image",
  Upload.array("image", 5),
  async (req, res) => {
    // Kiểm tra xem có tệp nào được tải lên không
    const { files } = req;
    if (files && files.length > 0) {
      try {
        const data = req.body; // Lấy dữ liệu từ body
        const urlsImage = files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        );
        // Tạo một đối tượng mới trái cây với các thông tin và đường dẫn hình ảnh
        const newFruit = new FruitModel({
          name: data.name,
          quantity: data.quantity,
          price: data.price,
          status: data.status,
          image: urlsImage, // Thêm đường dẫn hình ảnh vào trường 'image'
          description: data.description,
          id_distributor: data.id_distributor,
        });
        // Lưu trái cây mới vào cơ sở dữ liệu
        const result = await newFruit.save();
        if (result) {
          // Trả về thông báo thành công và dữ liệu trái cây đã được thêm
          res.json({
            status: 200,
            message: "Thêm trái cây thành công",
            data: result,
          });
        } else {
          // Trả về thông báo lỗi nếu không thêm được trái cây
          res.status(400).json({
            status: 400,
            message: "Lỗi, không thể thêm trái cây",
            data: [],
          });
        }
      } catch (error) {
        console.error("Lỗi khi thêm trái cây:", error);
        res.status(500).json({
          status: 500,
          message: "Lỗi server",
          data: [],
        });
      }
    } else {
      // Trả về thông báo lỗi nếu không có tệp nào được tải lên
      res.status(400).json({
        status: 400,
        message: "Không có tệp nào được tải lên",
        data: [],
      });
    }
  }
);
/////gui mail dang ky
const Users = require("./models/users");
const Transporter = require("./config/common/mail");
app.post("/register-send-email", Upload.single("avatar"), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req;
    const newUser = Users({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      //url avatar http://localhost:3000/uploads/filename
    });
    const result = await newUser.save();
    if (result) {
      //Gửi mail
      const mailOptions = {
        from: "doan379a@gmail.com", //email gửi đi
        to: result.email, // email nhận
        subject: "Đăng ký thành công", //subject
        text: "Cảm ơn bạn đã đăng ký", // nội dung mail
      };
      // Nếu thêm thành công result !null trả về dữ liệu
      await Transporter.sendMail(mailOptions); // gửi mail
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      // Nếu thêm không thành công result null, thông báo không thành công
      res.json({
        status: 400,
        messenger: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

////dang nhap tra ve token
const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });
    if (user) {
      //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
      //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới
      //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token,refreshToken mới
      //Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại
      const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
        expiresIn: "1d",
      });
      //expiresIn thời gian token
      res.json({
        status: 200,
        messenger: "Đăng nhâp thành công",
        data: user,
        token: token,
        refreshToken: refreshToken,
      });
    } else {
      // Nếu thêm không thành công result null, thông báo không thành công
      res.json({
        status: 400,
        messenger: "Lỗi, đăng nhập không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
