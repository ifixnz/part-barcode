import React from 'react';
import PartList from './Part.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PartCategory from './PartCategory.jsx';
import Col from 'react-bootstrap/Col';

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: null
        };
        this.handleCategorySelection = this.handleCategorySelection.bind(this);
    }

    handleCategorySelection(categoryId) {
        this.setState({currentCategory: categoryId});
    }

    render() {
        return (<Container>
            <Row>
                <Col sm={4}><PartCategory onCategorySelect={this.handleCategorySelection}/></Col>
                <Col sm={8}><PartList categoryId={this.state.currentCategory}/></Col>
            </Row>
        </Container>);
    }
}

export default MainPanel;
