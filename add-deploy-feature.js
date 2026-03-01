const fs = require('fs');
const path = require('path');

const builderPath = path.join(__dirname, 'components', 'Builder.tsx');
let content = fs.readFileSync(builderPath, 'utf-8');

// 1. Add import for DeployModal after WebLLMModal import
content = content.replace(
  "import WebLLMModal from './WebLLMModal';\nimport { uploadMedia, formatFileSize } from '../utils/mediaUpload';",
  "import WebLLMModal from './WebLLMModal';\nimport DeployModal from './DeployModal';\nimport { uploadMedia, formatFileSize } from '../utils/mediaUpload';"
);

// 2. Add state for PublishModal after showWebLLMModal
content = content.replace(
  'const [showWebLLMModal, setShowWebLLMModal] = useState(false);',
  'const [showWebLLMModal, setShowWebLLMModal] = useState(false);\n  const [showPublishModal, setShowPublishModal] = useState(false);'
);

// 3. Add Publish button before the Deploy button
content = content.replace(
  `              <button
                type="button"
                aria-label="Deploy project"
                onClick={handleExport}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-black transition-colors text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Deploy</span>
              </button>`,
  `              <button
                type="button"
                aria-label="Make site public"
                onClick={() => setShowPublishModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">Make Public</span>
              </button>

              <button
                type="button"
                aria-label="Deploy project"
                onClick={handleExport}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-black transition-colors text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Deploy</span>
              </button>`
);

// 4. Add DeployModal component before the closing </div> at the end of the JSX
content = content.replace(
  `      {/* 5. ANALYTICS MODAL */}`,
  `      {/* PUBLISH MODAL */}
      <DeployModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        bento={activeBento}
      />

      {/* 5. ANALYTICS MODAL */}`
);

fs.writeFileSync(builderPath, content, 'utf-8');
console.log('Successfully added deploy feature to Builder.tsx');
