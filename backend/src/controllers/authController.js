 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/backend/src/controllers/authController.js b/backend/src/controllers/authController.js
index 02c50c9f21626a21ca051f6f2199d7912075dc09..6f5657c163d298e32d61fa04c16125051102aba1 100644
--- a/backend/src/controllers/authController.js
+++ b/backend/src/controllers/authController.js
@@ -24,55 +24,63 @@ function parseExpiryToMs(expiry) {
   if (!expiry) {
     return 7 * 24 * 60 * 60 * 1000;
   }
 
   const raw = `${expiry}`.trim();
   const match = raw.match(/^(\d+)([smhd])$/i);
 
   if (!match) {
     return 7 * 24 * 60 * 60 * 1000;
   }
 
   const value = Number(match[1]);
   const unit = match[2].toLowerCase();
   const multipliers = {
     s: 1000,
     m: 60 * 1000,
     h: 60 * 60 * 1000,
     d: 24 * 60 * 60 * 1000
   };
 
   return value * multipliers[unit];
 }
 
 function getCookieOptions() {
   const isProduction = process.env.NODE_ENV === "production";
+  const rawClientUrls = `${process.env.CLIENT_URL || ""}`
+    .split(",")
+    .map((value) => value.trim().toLowerCase())
+    .filter(Boolean);
+
+  const usesSecureCookie = isProduction || rawClientUrls.some(
+    (url) => url.startsWith("https://") && !url.includes("localhost") && !url.includes("127.0.0.1")
+  );
 
   return {
     httpOnly: true,
-    secure: isProduction,
-    sameSite: isProduction ? "none" : "lax",
+    secure: usesSecureCookie,
+    sameSite: usesSecureCookie ? "none" : "lax",
     maxAge: parseExpiryToMs(process.env.JWT_EXPIRY || "7d")
   };
 }
 
 function signToken(user) {
   return jwt.sign(
     {
       id: user._id.toString()
     },
     process.env.JWT_SECRET,
     {
       expiresIn: process.env.JWT_EXPIRY || "7d"
     }
   );
 }
 
 export async function register(req, res, next) {
   try {
     const { name, email, studentId, password } = req.body;
 
     const existingUser = await User.findOne({
       $or: [
         { email: email.toLowerCase().trim() },
         { studentId: studentId.trim() }
       ]
@@ -137,51 +145,53 @@ export async function resolveLoginUser(req, res, next) {
     return next(error);
   }
 }
 
 export async function login(req, res, next) {
   try {
     const user = req.loginUser;
 
     if (!user) {
       return sendError(res, "Login context missing", 500);
     }
 
     const token = signToken(user);
     res.cookie("token", token, getCookieOptions());
 
     return sendSuccess(res, {
       message: "Login successful",
       user: sanitizeUser(user)
     });
   } catch (error) {
     return next(error);
   }
 }
 
 export function logout(req, res) {
+  const { secure, sameSite } = getCookieOptions();
+
   res.clearCookie("token", {
     httpOnly: true,
-    secure: process.env.NODE_ENV === "production",
-    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
+    secure,
+    sameSite
   });
 
   return sendSuccess(res, {
     message: "Logged out successfully"
   });
 }
 
 export async function me(req, res, next) {
   try {
     const user = await User.findById(req.user.id);
 
     if (!user) {
       return sendError(res, "Session is no longer valid", 401);
     }
 
     return sendSuccess(res, {
       user: sanitizeUser(user)
     });
   } catch (error) {
     return next(error);
   }
 }
 
EOF
)
