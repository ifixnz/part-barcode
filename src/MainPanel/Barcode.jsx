import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import InternalIDGeneratorPanel from './InternalIDGenerator.jsx';

class Barcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            templateName: null
        };
    }

    render() {
        if (this.props.show === false)
            return (<div/>);
        let tmpl = this.state.templateName;
        if (tmpl === null) {
            for (let i = 0; i < this.props.templateList.length; i++) {
                let m = this.props.templateList[i];
                if (m['preferred']) {
                    tmpl = m['metadata']['id'];
                    break;
                }
            }
        }
        let modalBody = null;
        if (tmpl === null && this.props.templateList.length === 0) {
            modalBody = (<p>No template available to generate barcode.</p>);
        } else {
            if (tmpl === null) {
                tmpl = this.props.templateList[0]['metadata']['id'];
            }
            if (this.props.part['internalPartNumber'] !== null && this.props.part['internalPartNumber'] !== '') {
                modalBody = (<>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">Template</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.templateList.map(t => <React.Fragment key={t.metadata.id}>
                                <OverlayTrigger placement="right"
                                                overlay={<Tooltip id={`tooltip-${t.metadata.id}`}>{t.metadata.description}</Tooltip>}>
                                    <Dropdown.Item active={t.metadata.id === tmpl}
                                                   onClick={() => this.setState({templateName: t.metadata.id})}>{t.metadata.name}</Dropdown.Item>
                                </OverlayTrigger>{' '}</React.Fragment>)}
                        </Dropdown.Menu>
                    </Dropdown>
                    <div style={{height:"10px"}}/>
                    <iframe src={`/pdf/barcode?t=${tmpl}&c=${encodeURIComponent(this.props.part['internalPartNumber'])}&description=${encodeURIComponent(this.props.part['name'])}&category=${encodeURIComponent(this.props.part.category['name'])}`}
                            frameBorder="0" width="100%" height="200px" title={this.props.part['name']}/>
                    <Table striped bordered hover>
                        <tbody>
                            <tr><td>Name</td><td>{this.props.part.name}</td></tr>
                            <tr><td>ID</td><td>{this.props.part.internalPartNumber}</td></tr>
                            <tr><td>Description</td><td>{this.props.part.description}</td></tr>
                            <tr><td>Category</td><td>{this.props.part.category.categoryPath}</td></tr>
                            <tr><td>Storage Location</td><td>{this.props.part.storageLocation.name}</td></tr>
                            <tr><td>Current Stock</td><td>{this.props.part.stockLevel}</td></tr>
                        </tbody>
                    </Table>
                </>);
            } else {
                modalBody = (<InternalIDGeneratorPanel part={this.props.part}/>);
            }
        }
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}
                size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Barcode;
