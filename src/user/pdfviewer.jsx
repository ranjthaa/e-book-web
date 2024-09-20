// PdfViewer.js
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core styles
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Default layout styles

const PdfViewer = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => {
      return (props) => {
        const { toolbarSlot } = props;
        const filteredToolbarSlot = toolbarSlot.filter(slot => !['Download', 'Print'].includes(slot.id));
        return <Toolbar toolbarSlot={filteredToolbarSlot} />;
      };
    },
  });

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;
