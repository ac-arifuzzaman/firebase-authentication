import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { useState } from "react";
import "./App.css";
import initializeAuthentication from "./Firebase/firebase.init";
import Navigation from "./Navigation";

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const faceBookProvider = new FacebookAuthProvider();

function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(loggedInUser);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(loggedInUser);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register hitted", email, password);
    if (password.length < 6) {
      setError("Password should be at lest 6 charactar long");
      return;
    }
    if (
      !/(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}/.test(
        password
      )
    ) {
      setError(
        "Password at lest 6 character, 2 upercase, 2 later, 3 lowercase, 1 special symbol "
      );
      return;
    }
    // isLogin ? processLogin(email, password) : createLogin(email, password);
    if (isLogin) {
      processLogin(email, password);
    } else {
      createLogin(email, password);
    }
  };

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const createLogin = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        emailVarification();
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const emailVarification = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      // Email verification sent!
      // ...
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChage = (e) => {
    setPassword(e.target.value);
  };

  const toogleLogin = (e) => {
    setIsLogin(e.target.checked);
    console.log(e.target.checked);
  };

  const changePassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleFBSignIn = () => {
    signInWithPopup(auth, faceBookProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="mx-5">
      <Navigation user={user}></Navigation>
      {user.email && (
        <div>
          <h1>hello {user.email}</h1>
          <h3>your name: {user.name}</h3>
          <img src={user.photo} alt="" />
        </div>
      )}
      <br />
      <form onSubmit={handleRegister}>
        <h2 className="text-primary">
          Please {isLogin ? "Login" : "Register"}
        </h2>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handleEmailChange}
              type="email"
              className="form-control"
              id="inputEmail3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handlePasswordChage}
              type="password"
              className="form-control"
              id="inputPassword3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input
                onClick={toogleLogin}
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered
              </label>
            </div>
            <div className="form-check">
              <input
                onClick={changePassword}
                className="form-check-input"
                type="checkbox"
                id="agridCheck1"
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                Reset Password
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <br />
      <br />
      <br />
      {user.email ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <div>
          <button onClick={handleGoogleSignIn}>Google Sign In</button>
          <button onClick={handleGithubSignIn}>Google Sign In</button>
          <button onClick={handleFBSignIn}>Facebook Sign In</button>
        </div>
      )}
    </div>
  );
}

export default App;
