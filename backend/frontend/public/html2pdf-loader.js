// html2pdf.js CDN loader for client-side PDF export
// This file is loaded dynamically in the dashboard page if not already present.
(function loadHtml2PdfJs() {
  if (!window.html2pdf) {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = function() { window.html2pdfLoaded = true; };
    document.head.appendChild(script);
  }
})();
