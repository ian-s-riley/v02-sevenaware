import React, {useState, useEffect} from "react";
import { Auth } from 'aws-amplify'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";

import styles from "assets/jss/material-dashboard-pro-react/views/lockScreenPageStyle.js";

const useStyles = makeStyles(styles);

export default function LockScreenPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [user, setUser] = useState()

  useEffect(() => {
    checkUser()
  }, []);

  async function checkUser() {
    const thisUser = await Auth.currentAuthenticatedUser()    
    console.log('checkUser : user', thisUser)              
    setUser(thisUser)
  }

  async function signOut() {
    try {
        await Auth.signOut();
        console.log('Auth.signOut')
        setUser([])
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

  React.useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <form>
      {user ? (
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
            <h4 className={classes.cardTitle}>{user.username}</h4>
            <h5 className={classes.cardTitle}>Is Authenticated</h5>
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
            <Button color="rose" round onClick={signOut}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>    
        ) : (
          <Card
          profile
          className={classes.customCardClass + " " + classes[cardAnimaton]}
        >          
          <CardBody profile>
            <h5 className={classes.cardTitle}>Not Authenticated</h5>
          </CardBody>
        </Card>   
        )}
                
      </form>
    </div>
  );
}
