#!/usr/bin/env python3
"""
Script to add deployment feature to Builder.tsx
Run with: python apply_deployment_changes.py
"""

import re

def modify_builder():
    builder_path = 'components/Builder.tsx'

    with open(builder_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add import for DeployModal
    content = re.sub(
        r"import WebLLMModal from '\./WebLLMModal';\nimport \{ uploadMedia, formatFileSize \} from '\.\./utils/mediaUpload';",
        "import WebLLMModal from './WebLLMModal';\nimport DeployModal from './DeployModal';\nimport { uploadMedia, formatFileSize } from '../utils/mediaUpload';",
        content
    )

    # 2. Add state for PublishModal
    content = re.sub(
        r'const \[showWebLLMModal, setShowWebLLMModal\] = useState\(false\);',
        'const [showWebLLMModal, setShowWebLLMModal] = useState(false);\n  const [showPublishModal, setShowPublishModal] = useState(false);',
        content
    )

    # 3. Add Publish button before Deploy button
    old_deploy_button = """              <button
                type="button"
                aria-label="Deploy project"
                onClick={handleExport}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-black transition-colors text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Deploy</span>
              </button>"""

    new_deploy_button = """              <button
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
              </button>"""

    content = content.replace(old_deploy_button, new_deploy_button)

    # 4. Add DeployModal component before Analytics modal
    content = content.replace(
        '{/* 5. ANALYTICS MODAL */}',
        '{/* PUBLISH MODAL */}\n      <DeployModal\n        isOpen={showPublishModal}\n        onClose={() => setShowPublishModal(false)}\n        bento={activeBento}\n      />\n\n      {/* 5. ANALYTICS MODAL */}'
    )

    with open(builder_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ Successfully added deployment feature to Builder.tsx")

if __name__ == '__main__':
    modify_builder()
