import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSort } from "@fortawesome/free-solid-svg-icons"; // Import sort icon
import { API_URL } from "constants";
import "./Tables.css"; // Ensure to include custom CSS

const Tables = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const location = useLocation();
  const [,setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/Student/GetStudents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    setSearchTerm(searchQuery);

    const filtered = students.filter((student) =>
      Object.values(student).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [location.search, students]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = () => {
    const sortableStudents = [...filteredStudents];
    if (sortConfig.key !== null) {
      sortableStudents.sort((a, b) => {
        let comparison = 0;
        const key = sortConfig.key;
        if (a[key] > b[key]) {
          comparison = 1;
        } else if (a[key] < b[key]) {
          comparison = -1;
        }
        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return sortableStudents;
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents().slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 4;
    const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPageNumbersToShow);
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i} className={currentPage === i ? "active" : ""}>
          <PaginationLink
            href="#pablo"
            onClick={(e) => {
              e.preventDefault();
              paginate(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const confirmDelete = (id) => {
    setDeleteStudentId(id);
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/Student/DeleteStudent/${deleteStudentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(students.filter((student) => student.id !== deleteStudentId));
      setFilteredStudents(filteredStudents.filter((student) => student.id !== deleteStudentId));
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  return (
    <>
      <Container className="mt-4" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Student List</h3>
                <div className="d-flex align-items-center">
                  <Button
                    color="primary"
                    className="mr-3 d-none d-md-block"
                    tag={Link}
                    to="/students/add-student"
                    style={{ whiteSpace: "nowrap", marginLeft: '1rem' }}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Student
                  </Button>
                  <Button
                    color="primary"
                    className="ml-2 d-block d-md-none"
                    tag={Link}
                    to="/students/add-student"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name
                      {sortConfig.key === 'name' && (
                        <FontAwesomeIcon
                          icon={faSort}
                          className={`ml-2 ${sortConfig.direction === 'ascending' ? 'fa-flip-vertical' : ''}`}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>
                      Gender
                      {sortConfig.key === 'gender' && (
                        <FontAwesomeIcon
                          icon={faSort}
                          className={`ml-2 ${sortConfig.direction === 'ascending' ? 'fa-flip-vertical' : ''}`}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort('age')} style={{ cursor: 'pointer' }}>
                      Age
                      {sortConfig.key === 'age' && (
                        <FontAwesomeIcon
                          icon={faSort}
                          className={`ml-2 ${sortConfig.direction === 'ascending' ? 'fa-flip-vertical' : ''}`}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort('education')} style={{ cursor: 'pointer' }}>
                      Education
                      {sortConfig.key === 'education' && (
                        <FontAwesomeIcon
                          icon={faSort}
                          className={`ml-2 ${sortConfig.direction === 'ascending' ? 'fa-flip-vertical' : ''}`}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort('academicYear')} style={{ cursor: 'pointer' }}>
                      Academic Year
                      {sortConfig.key === 'academicYear' && (
                        <FontAwesomeIcon
                          icon={faSort}
                          className={`ml-2 ${sortConfig.direction === 'ascending' ? 'fa-flip-vertical' : ''}`}
                        />
                      )}
                    </th>
                    <th scope="col"> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.gender}</td>
                      <td>{student.age}</td>
                      <td>{student.education}</td>
                      <td>{student.academicYear}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              tag={Link}
                              to={`/students/edit-student/${student.id}`}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => confirmDelete(student.id)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(1);
                        }}
                      >
                        <i className="fas fa-angle-double-left" />
                        <span className="sr-only">First</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(currentPage - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    {renderPageNumbers()}
                    <PaginationItem className={currentPage === totalPages ? "disabled" : ""}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(currentPage + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={currentPage === totalPages ? "disabled" : ""}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(totalPages);
                        }}
                      >
                        <i className="fas fa-angle-double-right" />
                        <span className="sr-only">Last</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal} centered>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this student?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>{" "}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Tables;
