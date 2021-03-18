import React, {useState, useEffect} from "react";
import { Auth } from 'aws-amplify';


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardAvatar from "components/Card/CardAvatar.js";

import avatar from "assets/img/faces/marc.jpg";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [user, setUser] = useState({username: "", password: "", isAuthenticated: false});

  React.useEffect(() => {
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
      setUser({username: thisUser.username, password: "", isAuthenticated: true})
    } catch (error) {
        console.log('error signing in', error)
    } 
  }

  function handleChange(e) {
    const {id, value} = e.currentTarget;
    setUser({ ...user, [id]: value})      
  }

  async function signIn() {
    //console.log('signIn : user', user)
    try {
        const thisUser = await Auth.signIn(user.username, user.password);
        console.log('signIn : thisUser',thisUser)
        setUser({username: thisUser.username, password: "", isAuthenticated: true})
    } catch (error) {
        console.log('error signing in', error);
    }
  }

  async function signOut() {
    try {
        await Auth.signOut();
        console.log('Auth.signOut')
        setUser({username: "", password: "", isAuthenticated: false})
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

  const classes = useStyles();
  return (
    <div className={classes.container}>
    {user.isAuthenticated ? (
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
    ) : (
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
                  labelText="Email..."
                  id="username"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.username,   
                    endAdornment: (
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
                <Button 
                  color="primary" 
                  simple size="lg" 
                  block
                  onClick={signIn}>
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    )}
    </div>
  );
}
