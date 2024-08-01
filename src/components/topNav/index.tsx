import Icons from "../customIcons";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
 
function TopNav() {

  const router = useRouter();
  const _token = Cookies.get("code");

  return (

    <div className="topNav">

      <div className="topNavTitle">
        {/* <Image src={""} alt="Remember Well"/> */}
        <div className="heart">
        <Icons icon="heart" />
        </div>
        <div className="title">
        <Icons icon="unfadingtilte" />
        </div>
      </div>
      {
        _token!=undefined?<> <div className="topNavMenu">

        {
          _token!=undefined?<>
          {[false].map((expand) => (
          <Navbar key={expand.toString()} expand={expand} className="">
            <Container fluid>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} >
                <Icons icon="menu1" />

              </Navbar.Toggle>
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    <Icons icon="unfadeingicon" />

                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/manage-account?type=settings">My Account</Nav.Link>
                    <Nav.Link href="/manage-account?type=stars">Unfading Heart</Nav.Link>
                    <Nav.Link href="https://03a1df-fa.myshopify.com/" target="blank">Visit Store</Nav.Link>
                    <Nav.Link href="#action2" onClick={(e) => {
                      e.preventDefault();
                      Cookies.remove("code");
                      router.replace("/")
                     }}>Sign Out</Nav.Link>

                  </Nav>

                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))}
          </>:<></>
        }
      </div></>:<></>
      }
     


    </div>
  );
}

export default TopNav;