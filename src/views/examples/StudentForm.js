import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  FormFeedback,
} from "reactstrap";
import Joi from "joi";
import { API_URL } from "constants";
import { useNavigate, useParams } from "react-router-dom";

import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

const schema = Joi.object({
  Name: Joi.string().required().label("Name"),
  Gender: Joi.string().valid("M", "F").required().label("Gender"),
  Age: Joi.number().required().label("Age"),
  Education: Joi.string().required().label("Education"),
  AcademicYear: Joi.number().required().label("Academic Year"),
});



const StudentForm = (props) => {
  const mode = props.mode
  const [student, setStudent] = useState({
    Name: "",
    Gender: "",
    Age: "",
    Education: "",
    AcademicYear: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchStudent = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/api/Student/GetStudents`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          let _student = student;
          if (Array.isArray(response.data)) {
            const _id = Number(id)
            console.log("🚀 ~ fetchStudent ~ _id:", _id)
            _student = response.data.find((s) => s.id === _id);
            console.log("🚀 ~ fetchStudent ~ student:", _student)
            if (!_student) {
              console.error(`Student with ID ${id} not found`);
            }
            else {
              console.error("Error fetching student")
            }
          }
  
          // Capitalize field names
          const capitalizedStudent = {};
          Object.keys(_student).filter(k => k.toLowerCase() !== 'id').forEach(key => {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            capitalizedStudent[capitalizedKey] = _student[key];
          });
  
          setStudent(capitalizedStudent);
        } catch (error) {
          console.error("Error fetching student", error);
        }
      };
      fetchStudent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
    // Clear validation error for the field being edited
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate student data before submitting
    const { error } = schema.validate(student, { abortEarly: false });
    console.log("🚀 ~ handleSubmit ~ error:", error)

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (mode === "edit") {
        await axios.put(
          `${API_URL}/api/Student/UpdateStudent/${id}`,
          {
            ...student,
            Age: Number(student.Age),
            AcademicYear: Number(student.AcademicYear),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/Student/AddStudent`,
          {
            ...student,
            Age: Number(student.Age),
            AcademicYear: Number(student.AcademicYear),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate("/admin"); // Redirect after successful submission
    } catch (error) {
      console.error("Error saving student", error);
    }
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>{mode === "edit" ? "Edit Student" : "Add Student"}</small>
          </div>
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-badge" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="Name"
                  placeholder="Name"
                  type="text"
                  value={student.Name}
                  onChange={handleChange}
                  invalid={!!errors.Name}
                />
                <FormFeedback>{errors.Name}</FormFeedback> {/* Display error message */}
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-atom" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="Gender"
                  placeholder="Gender (M/F)"
                  type="text"
                  value={student.Gender}
                  onChange={handleChange}
                  invalid={!!errors.Gender}
                />
                <FormFeedback>{errors.Gender}</FormFeedback> {/* Display error message */}
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-calendar-grid-58" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="Age"
                  placeholder="Age"
                  type="number"
                  value={student.Age}
                  onChange={handleChange}
                  invalid={!!errors.Age} // Set invalid state based on errors.Age
                />
                <FormFeedback>{errors.Age}</FormFeedback> {/* Display error message */}
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="Education"
                  placeholder="Education"
                  type="text"
                  value={student.Education}
                  onChange={handleChange}
                  invalid={!!errors.Education} // Set invalid state based on errors.Education
                />
                <FormFeedback>{errors.Education}</FormFeedback> {/* Display error message */}
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-books" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="AcademicYear"
                  placeholder="Academic Year"
                  type="number"
                  value={student.AcademicYear}
                  onChange={handleChange}
                  invalid={!!errors.AcademicYear} // Set invalid state based on errors.AcademicYear
                />
                <FormFeedback>{errors.AcademicYear}</FormFeedback> {/* Display error message */}
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button className="my-4" color="primary" type="submit">
                {mode === "edit" ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
    <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default StudentForm;
