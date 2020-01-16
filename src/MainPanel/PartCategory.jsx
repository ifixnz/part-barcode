import React from 'react';
import $ from 'jquery';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

class PartCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partCategories: null
        };
        this.loadAllPartCategories = this.loadAllPartCategories.bind(this);
        this.createPartCategory = this.createPartCategory.bind(this);
        this.toggleText = this.toggleText.bind(this);
    }

    loadAllPartCategories() {
        $.ajax({
            type: 'GET',
            url: '/api/part_categories/1',
            success: data => {
                this.setState({partCategories: data});
            },
            error: () => {
                this.setState({partCategories: null});
            }
        });
    }

    componentDidMount() {
        this.loadAllPartCategories();
    }

    toggleText(target) {
        if (target.textContent === '-') {
            target.textContent = '+';
        } else if (target.textContent === '+') {
            target.textContent = '-';
        }
    }

    createPartCategory(node) {
        if (node.children.length === 0) {
            return (<ListGroup.Item>
                <Button variant="link" onClick={() => console.log(node['@id'] + ' selected.')}>{node.name}</Button>
            </ListGroup.Item>);
        }
        return (<Accordion defaultActiveKey={node['@id']}>
            <ListGroup.Item>
                <ButtonToolbar>
                    <Accordion.Toggle as={Button} variant="light" eventKey={node['@id']} onClick={(e) => this.toggleText(e.target)}>-</Accordion.Toggle>
                    <Button variant="link" onClick={() => console.log(node['@id'] + ' selected.')}>{node.name}</Button>
                </ButtonToolbar>
            </ListGroup.Item>
            <Accordion.Collapse eventKey={node['@id']}>
                <ListGroup>
                    {node.children.map(row => <ListGroup.Item key={row['@id']}>{this.createPartCategory(row)}</ListGroup.Item>)}
                </ListGroup>
            </Accordion.Collapse>
        </Accordion>);
    }

    render() {
        if (this.state.partCategories == null) {
            return (<p>Loading part categories...</p>);
        }
        return (<ListGroup>
            {this.createPartCategory(this.state.partCategories)}
        </ListGroup>);
    }
}

export default PartCategory;
