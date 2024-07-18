import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import useMediaQuery from "hooks/useMediaQuery";

const AdminNavbar = (props) => {
  const isDesktop = useMediaQuery('(min-width: 960px)');
  console.log("🚀 ~ AdminNavbar ~ isDesktop:", isDesktop)
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState(new URLSearchParams(location.search).get("search") || "");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatarColor, setAvatarColor] = useState("#000");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const name = decodedToken.name;
        const email = decodedToken.email;
        setUsername(name);
        setUserEmail(email);
        setAvatarColor(generateGradientColor(name));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      navigate({ search: params.toString() });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, navigate]);

  const handleSearchChange = (e) => {
    if (isDesktop) {
      setSearchValue(e.target.value);
    }
  };

  const generateGradientColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color1 = `#${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}${((hash >> 16) & 0xff).toString(16).padStart(2, '0')}${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}`;
    const color2 = `#${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}${(hash & 0xff).toString(16).padStart(2, '0')}${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}`;
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  return (
    <>
      <Navbar className="mt-3" expand="md" id="navbar-main" style={{ zIndex: 99 }}>
        <Container fluid className="d-flex justify-content-between">
          <Link
            className="h4 mb-0 text-uppercase d-none d-lg-inline-block"
            to="/admin"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-light form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input 
                  placeholder="Search" 
                  type="text" 
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <Media className="d-flex flex-column align-items-end">
              <span className="mb-0 text-sm-light font-weight-bold">
                {username}
              </span>
              <span className="mb-0 text-xs text-muted">
                {userEmail}
              </span>
            </Media>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span
                    className="avatar avatar-sm rounded-circle"
                    style={{
                      background: avatarColor,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff"
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem href="/auth/login">
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
