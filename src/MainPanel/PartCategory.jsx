import React from 'react';
import $ from 'jquery';
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
        this.categorySelectionCallback = this.categorySelectionCallback.bind(this);
        this.getSubCategories = this.getSubCategories.bind(this);
        this.buildSubCategoryCache = this.buildSubCategoryCache.bind(this);
        this.subCategoryCache = {};
    }

    loadAllPartCategories() {
        $.ajax({
            type: 'GET',
            url: '/api/part_categories/1',
            success: data => {
                this.setState({partCategories: data}, () => this.buildSubCategoryCache(this.state.partCategories, []));
            },
            error: () => {
                this.setState({partCategories: null});
            }
        });
    }

    categorySelectionCallback(categoryId) {
        if (this.props.onCategorySelect) {
            let subCats = this.getSubCategories(categoryId);
            this.props.onCategorySelect(subCats);
        }
    }

    componentDidMount() {
        this.loadAllPartCategories();
    }

    getSubCategories(categoryId) {
        if (categoryId in this.subCategoryCache) {
            return this.subCategoryCache[categoryId];
        }
        return [categoryId];
    }

    buildSubCategoryCache(category, parents) {
        parents.push(category['@id']);
        if (parents.length > 0) {
            for (let index = 0; index < parents.length; index++) {
                let parent = parents[index];
                if ((parent in this.subCategoryCache) === false) {
                    this.subCategoryCache[parent] = new Set([]);
                }
                this.subCategoryCache[parent].add(category['@id']);
                for (let jndex = 0; jndex < category.children.length; jndex++) {
                    let child = category.children[jndex];
                    if (child.children.length > 0) {
                        this.buildSubCategoryCache(child, parents.slice());
                    } else {
                        this.subCategoryCache[parent].add(child['@id']);
                    }
                }
            }
        }
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
            return (
                <Button variant="link" onClick={() => this.categorySelectionCallback(node['@id'])}>{node.name}</Button>
            );
        }
        return (<Accordion defaultActiveKey={node['@id']}>
            <ul className="list-group" style={{listStyleType: "none"}}>
                <li style={{marginLeft: "-5px"}}>
                    <ButtonToolbar>
                        <Accordion.Toggle as={Button} variant="light" eventKey={node['@id']} onClick={(e) => this.toggleText(e.target)}>-</Accordion.Toggle>
                        <Button variant="link" onClick={() => this.categorySelectionCallback(node['@id'])}>{node.name}</Button>
                    </ButtonToolbar>
                </li>
                <Accordion.Collapse eventKey={node['@id']}>
                    <ul style={{listStyleType: "none"}}>
                        {node.children.map(row => <li style={{marginLeft: "-5px"}} key={row['@id']}>{this.createPartCategory(row)}</li>)}
                    </ul>
                </Accordion.Collapse>
            </ul>
        </Accordion>);
    }

    render() {
        if (this.state.partCategories == null) {
            return (<p>Loading part categories...</p>);
        }
        return this.createPartCategory(this.state.partCategories);
    }
}

export default PartCategory;
