import React, {useState} from "react";
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

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

export default function RegisterPage() {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [checked, setChecked] = useState([]);
  const [user, setUser] = useState({ email: "", name:"", password: "", phone: "", confirmCode: "" })
  const [confirmUser, setConfirmUser] = useState(false);

  React.useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  async function signUp() {
      try {
          const { newUser } = await Auth.signUp({
              username: user.email,
              password: user.password,
              attributes: {
                  email: user.email,          // optional
                  //phone_number: user.phone,   // optional - E.164 number convention
                  // other custom attributes 
              }
          });
          console.log('signUp: user', newUser);
          setConfirmUser(true)
      } catch (error) {
          console.log('error signing up:', error);
      }
  }

  async function confirmSignUp() {
      try {
        await Auth.confirmSignUp(user.email, user.confirmCode);
      } catch (error) {
          console.log('error confirming sign up', error);
      }
  }

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
    setChecked(newChecked);
  };
  
  const classes = useStyles();
  
  return (
    <div className={classes.container}>
      {confirmUser ? (
        <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={6}>
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
                  labelText="Name"
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.name,   
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                <CustomInput
                  labelText="Phone Number"
                  id="phone"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.phone,   
                    endAdornment: (
                      <InputAdornment position="end">
                        <Code className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
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
                <Button 
                  color="primary" 
                  simple size="lg" 
                  block
                  onClick={signUp}>
                  Let's Go
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      ) : (
        <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={6}>
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
                  labelText="Phone Number"
                  id="confirmCode"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: (event) => handleChange(event),
                    value: user.confirmCode,   
                    endAdornment: (
                      <InputAdornment position="end">
                        <Code className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button 
                  color="primary" 
                  onClick={confirmSignUp}
                  simple size="lg" 
                  block>
                  Verify Your Account
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
