import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import { fieldsByLenderId} from '../../graphql/queries';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import ReactTableFields from "components/ReactTable/ReactTableFields.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

export default function SevenAFields() {
  const useStyles = makeStyles(styles);
  const history = useHistory();

  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const [fieldPrefix, setFieldPrefix] = useState()
  
  const [nextToken, setNextToken] = useState(undefined)
  const [nextNextToken, setNextNextToken] = useState()
  const [previousTokens, setPreviousTokens] = useState([])

  useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });

  useEffect(() => {
    fetchFields();
  }, [fieldPrefix, nextToken]);

  async function fetchFields() {
    const apiData = await API.graphql(graphqlOperation(fieldsByLenderId, {
      lenderId: "-1", 
      name: {beginsWith: fieldPrefix},
      nextToken,
      sort: {
        direction: 'asc',
      }
    }));    

    //console.log('fetchFields : apidata', apiData)
    setNextNextToken(apiData.data.fieldsByLenderId.nextToken)

    const fieldsFromAPI = apiData.data.fieldsByLenderId.items     
    //setFields(fieldsFromAPI);    
    setData(
      fieldsFromAPI.map((field, key) => {
      return {
        id: field.id,
        name: field.name,
        code: field.code,
        fieldType: field.fieldType,
        description: field.description,
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a edit kind of action */}
            <Button
              justIcon
              round
              simple
              onClick={() => handleSelectField(field.id)}
              color="warning"
              className="edit"
            >
              <Dvr />
            </Button>
          </div>
        )
      };
    })
    )

  }    

  const hasNext = !!nextNextToken
  const hasPrev = previousTokens.length

  const next = () => {
    setPreviousTokens((prev) => [...prev, nextToken])
    setNextToken(nextNextToken)
    setNextNextToken(null)
  }

  const prev = () => {
    setNextToken(previousTokens.pop())
    setPreviousTokens([...previousTokens])
    setNextNextToken(null)
  }

  const reset = () => {
    setNextToken(undefined)
    setPreviousTokens([])
    setNextNextToken(null)
  }  

  function handleChangePrefix(e) {
      const {id, value} = e.currentTarget;
      setFieldPrefix(value)      
  }

  function handleSelectField(fieldId) {
    history.push("/admin/fieldEdit", { fieldId: fieldId })
  }

  function newField() {
    history.push("/admin/fieldEdit", { fieldId: "" })
  }

  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader>
          <GridContainer>
          <GridItem xs={12} sm={12} md={2}>
            <Button 
              disabled={!hasPrev}
              onClick={prev}>
              Previous 100
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Button 
              disabled={!hasNext}
              onClick={next}>
              Next 100
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Button 
              onClick={reset}>
              Reset
            </Button>
          </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Filter by name..."
                id="fieldPrefix"
                name="fieldPrefix"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChangePrefix(event),
                  value: fieldPrefix,                
                }}                           
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
            <Button 
              color="success"
              onClick={newField}>
              New
            </Button>
          </GridItem>            
          </GridContainer>   
          </CardHeader>
          <CardBody>                 
            <ReactTableFields
              columns={[
                {
                  Header: "Name",
                  accessor: "name",
                },
                {
                  Header: "Code",
                  accessor: "code"
                },
                {
                  Header: "Input Type",
                  accessor: "fieldType"
                },
                {
                  Header: "",
                  accessor: "actions"
                }
              ]}
              data={data}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
