import React, {useState, useEffect} from "react";
import { Auth } from 'aws-amplify';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardAvatar from "components/Card/CardAvatar.js";

import avatar from "assets/img/faces/marc.jpg";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

const initialUserState = { 
  email: "", 
  name:"", 
  password: "", 
  phone: "", 
  isLender: false, 
  confirmCode: "",
 }

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [checked, setChecked] = useState([]);
  const [user, setUser] = useState(initialUserState)
  const [authState, setAuthState] = useState("login")
  const [emailState, setEmailState] = useState("")
  const [phoneState, setPhoneState] = useState("")

  useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  useEffect(() => {
    checkUser()
  }, []);

  async function checkUser() {
    try {
      const thisUser = await Auth.currentAuthenticatedUser()    
      //console.log('checkUser : thisUser', thisUser)                 
      setUser({ ...user, username: thisUser.username})
      setAuthState("loggedIn")
    } catch (error) {
        console.log('error signing in', error)
    } 
  }

  async function signIn() {
    //console.log('signIn : user', user)
    try {
        const thisUser = await Auth.signIn(user.email, user.password);
        //console.log('signIn : thisUser',thisUser)
        setUser({ ...user, username: thisUser.username})
        setAuthState("loggedIn")
    } catch (error) {
        console.log('error signing in', error.message);
        switch (error.message) {
        case "User does not exist.":
          alert("Plese double check your credentials. Or register for an account.");
          break
        default: 
          alert(error.message)
      }
    }
  }

  async function signUp() {
    await Auth.signOut();
    //console.log('Auth.signOut')  

    try {
          const { newUser } = await Auth.signUp({
              username: user.email,
              password: user.password,
              attributes: {
                  email: user.email,          // optional
                  //phone_number: user.phone,   // optional - E.164 number convention
                  //isLender: user.isLender
              }
          });
          console.log('signUp: user', newUser);
          setAuthState("confirm")
      } catch (error) {
          console.log('signUp: error.message', error.message)
          switch (error.message) {
            case "Username cannot be empty":
              alert("Plese enter your email address.");
              break
            case "Password cannot be empty":
              alert("Please enter your password.")
              break
              case "User already exists":
                alert("This user already exists, please log in or confirm your account.")
                setAuthState("confirm")
                break
            default: 
              alert(error.message)
          }
      }
  }

  async function confirmSignUp() {
      try {
        await Auth.confirmSignUp(user.email, user.confirmCode);
      } catch (error) {
          console.log('error confirming sign up', error);
      }
  }

  async function signOut() {
    try {
        await Auth.signOut();
        //console.log('Auth.signOut')
        setUser(initialUserState)
        setAuthState("login")
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
    return true;
    }
    return false;
  };

  const verifyPhone = value => {
    var phoneE164Rex = /^\+?[1-9]\d{1,14}$/;
    var phoneRex = /^\\d{10}$/
    if (phoneRex.test(value)) {
      return true;
    }
      return true;
  };

  function handleChange(e) {
    const {id, value} = e.currentTarget;
    setUser({ ...user, [id]: value})      
  }

  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log('handleToggle: newChecked', newChecked.length)
    newChecked.length === 0 ? setUser({ ...user, isLender: false}) : setUser({ ...user, isLender: true})
  }
  
  const classes = useStyles();
  
  const loginScreen = (
    <div className={classes.container}>
    <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
              <CustomInput
                    labelText="Email"
                    success={emailState === "success"}
                    error={emailState === "error"}
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyEmail(event.target.value)) {
                          setEmailState("success");
                        } else {
                          setEmailState("error");
                        }
                        handleChange(event);
                      },
                      type: "email",
                      endAdornment:
                        emailState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                    }}
                  />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.password,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off"
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <Button 
                  color="primary" 
                  simple size="lg" 
                  block
                  onClick={signIn}>
                  Sign In
                </Button> 
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                  <div align="Center">
                    <a href="#" onClick={() => setAuthState("register")}>
                      ...or register a new account
                    </a>
                  </div>
                  </GridItem>
                </GridContainer>                            
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      </div>
  )

  const loggedInScreen = (
    <div className={classes.container}>
    <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card
            profile
            className={classes.customCardClass + " " + classes[cardAnimaton]}
            >          
            <CardAvatar profile className={classes.cardAvatar}>
              <a href="#" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardHeader}>{user.username}</h4>
            </CardBody>
            <CardFooter className={classes.justifyContentCenter}>
              <Button color="primary" round onClick={signOut}>
                Sign Out
              </Button>
            </CardFooter>
          </Card>  
          </form>
        </GridItem>
      </GridContainer>   
      </div>
  )

  const registerScreen = (
    <div className={classes.container}>
    <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Sign Up</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                    labelText="Email"
                    success={emailState === "success"}
                    error={emailState === "error"}
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyEmail(event.target.value)) {
                          setEmailState("success");
                        } else {
                          setEmailState("error");
                        }
                        handleChange(event);
                      },
                      type: "email",
                      endAdornment:
                        emailState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                    }}
                  />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.password,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    autoComplete: "off"
                  }}
                />
                 <FormControlLabel
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel
                      }}
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(1)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      label={
                        <span>
                          I am registering as a{" "}
                          <a href="#">lender or banking institution</a>.
                        </span>
                      }
                    />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Button 
                    color="primary" 
                    simple size="lg" 
                    block
                    onClick={signUp}>
                    Let's Go
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div align="Center">
                    <a href="#" onClick={() => setAuthState("login")}>
                      ...or sign in here
                    </a>
                  </div>
                  </GridItem>
                </GridContainer>                                 
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      </div>
  )

  const confirmScreen = (
    <div className={classes.container}>
    <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Confirm</h4>
              </CardHeader>
              <CardBody>
              <CustomInput
                  labelText="Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.email,   
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                <CustomInput
                  labelText="6 Digit Confirmation Code"
                  id="confirmCode"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.confirmCode, 
                    maxLength: 6,  
                    endAdornment: (
                      <InputAdornment position="end">
                        <Code className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />              
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Button 
                    color="primary" 
                    onClick={confirmSignUp}
                    simple size="lg" 
                    block>
                    Verify Your Account
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div align="Center">
                    <a href="#" onClick={() => setAuthState("login")}>
                      ...or sign in here
                    </a>
                  </div>
                  </GridItem>
                </GridContainer>                  
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      </div>
  )

  switch (authState) {
    case "loggedIn":
      return loggedInScreen
      break
    case "confirm":
      return confirmScreen
      break
    case "register":
      return registerScreen
    default:
      return loginScreen
  }
}
