// login.js
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDrb28-g7QuQnOv8bYodYpFlquoXD9Rk84",
  authDomain: "corretor-db-24148.firebaseapp.com",
  projectId: "corretor-db-24148",
};

const email = "breno.ucb@gmail.com";
const senha = "123456789";

async function login() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const token = await userCredential.user.getIdToken();
    console.log("✅ TOKEN OBTIDO:\n", token);
  } catch (error) {
    console.error("❌ Erro ao autenticar:", error.message);
  }
}

login();
