import React, { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';
import { Button, Modal } from 'react-bootstrap';

const BarcodeScanner = ({ onScan }) => {
  const [show, setShow] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerRef.current,
        constraints: {
          width: 480,
          height: 320,
          facingMode: "environment"
        },
      },
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "code_128_reader"]
      },
    }, err => {
      if (err) {
        console.error("Failed to initialize scanner", err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(result => {
      const code = result.codeResult.code;
      onScan(code);
      stopScanner();
    });
  };

  const stopScanner = () => {
    Quagga.stop();
    setShow(false);
  };

  useEffect(() => {
    return () => {
      if (Quagga) {
        Quagga.stop();
      }
    };
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => {
        setShow(true);
        setTimeout(startScanner, 300);
      }}>
        مسح الباركود
      </Button>

      <Modal show={show} onHide={stopScanner} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>الماسح الضوئي للباركود</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={scannerRef} style={{ width: '100%', height: '300px' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={stopScanner}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BarcodeScanner;
