import React, { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

import useMediaQuery from "hooks/useMediaQuery";

const Sidebar = (props) => {
  const isDesktop = useMediaQuery('(min-width: 960px)');
  console.log("🚀 ~ Sidebar ~ isDesktop:", isDesktop)
  const location = useLocation()
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [searchValue, setSearchValue] = useState(new URLSearchParams(location.search).get("search") || "");
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { routes, logo } = props;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // eslint-disable-next-line
      const params = new URLSearchParams(location.search);
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      navigate({ search: params.toString() });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line
  }, [searchValue, navigate]);

 
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const handleSearchChange = (e) => {
    if (!isDesktop) {
      setSearchValue(e.target.value);
    }
  };


  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={closeCollapse}
        >
          <i className={prop.icon} />
          {prop.name}
        </NavLink>
      </NavItem>
    ));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const name = decodedToken.name;
        setUsername(name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Props destructuring for logo
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }


  const generateGradientColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color1 = `#${((hash >> 24) & 0xff)
      .toString(16)
      .padStart(2, "0")}${((hash >> 16) & 0xff)
      .toString(16)
      .padStart(2, "0")}${((hash >> 8) & 0xff)
      .toString(16)
      .padStart(2, "0")}`;
    const color2 = `#${((hash >> 8) & 0xff)
      .toString(16)
      .padStart(2, "0")}${(hash & 0xff)
      .toString(16)
      .padStart(2, "0")}${((hash >> 24) & 0xff)
      .toString(16)
      .padStart(2, "0")}`;
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span
                  className="avatar avatar-sm rounded-circle"
                  style={{
                    background: generateGradientColor(username),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/auth/login`);
                }}
              >
                Logout <i className="ni ni-user-run ml-2" />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation Links */}
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
