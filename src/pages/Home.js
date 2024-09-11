import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";


/**
 * Home 
 * The basic Home page component.
 */
export default function Home() {

  return (
    <section className="col home">
      <Card className="home">
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">
              Welcome to Pokemon Team Builder!
            </h3>
          </CardTitle>
        </CardBody>
      </Card> 
    </section>
  );
}
