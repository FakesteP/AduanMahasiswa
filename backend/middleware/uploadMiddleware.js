import multer from "multer";

// Konfigurasi multer untuk menyimpan file di memory (buffer)
const storage = multer.memoryStorage();

// Filter file untuk hanya menerima PDF dan gambar
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa PDF atau gambar (JPEG, PNG, GIF)"), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal 5MB
  },
});

export default upload;
