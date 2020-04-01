import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class Barcode extends React.Component {

    render() {
        if (this.props.show === false)
            return (<div/>);
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}
                size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <embed src={`/barcode?t=STOCK&c=${this.props.part['internalPartNumber']}&description=${this.props.part['name']}&category=${this.props.part.category['name']}`}
                           frameBorder="0" width="100%" height="200px"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Barcode;
