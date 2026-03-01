#!/bin/bash
# Script to apply deployment feature changes to Builder.tsx

set -e  # Exit on any error

BUILDER_FILE="components/Builder.tsx"

echo "🔧 Applying deployment feature changes to Builder.tsx..."
echo ""

# Check if file exists
if [ ! -f "$BUILDER_FILE" ]; then
    echo "❌ Error: $BUILDER_FILE not found"
    exit 1
fi

# Backup the original file
echo "📦 Creating backup: ${BUILDER_FILE}.bak"
cp "$BUILDER_FILE" "${BUILDER_FILE}.bak"

# Change 1: Add DeployModal import
echo "1️⃣ Adding DeployModal import..."
sed -i "s|import WebLLMModal from './WebLLMModal';|import WebLLMModal from './WebLLMModal';\nimport DeployModal from './DeployModal';|g" "$BUILDER_FILE"

# Change 2: Add showPublishModal state
echo "2️⃣ Adding showPublishModal state..."
sed -i "s|const \[showWebLLMModal, setShowWebLLMModal\] = useState(false);|const [showWebLLMModal, setShowWebLLMModal] = useState(false);\n  const [showPublishModal, setShowPublishModal] = useState(false);|g" "$BUILDER_FILE"

# Change 3: Add Make Public button before Deploy button
echo "3️⃣ Adding Make Public button..."
# This is more complex, so we'll use a marker approach
PUB_BUTTON='<button
                type="button"
                aria-label="Make site public"
                onClick={() => setShowPublishModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">Make Public</span>
              </button>'

# Find and insert before Deploy button
awk -v pub_button="$PUB_BUTTON" '/Deploy project/ && !found {print pub_button "\n"; found=1} {print}' "$BUILDER_FILE" > "${BUILDER_FILE}.tmp" && mv "${BUILDER_FILE}.tmp" "$BUILDER_FILE"

# Change 4: Add DeployModal component
echo "4️⃣ Adding DeployModal component..."
awk '/\/\* 5\. ANALYTICS MODAL \*\// && !found {print "{/* PUBLISH MODAL */}\n      <DeployModal\n        isOpen={showPublishModal}\n        onClose={() => setShowPublishModal(false)}\n        bento={activeBento}\n      />\n\n"; found=1} {print}' "$BUILDER_FILE" > "${BUILDER_FILE}.tmp" && mv "${BUILDER_FILE}.tmp" "$BUILDER_FILE"

echo ""
echo "✅ Changes applied successfully!"
echo ""
echo "📋 Summary of changes:"
echo "   - Added DeployModal import"
echo "   - Added showPublishModal state"
echo "   - Added Make Public button"
echo "   - Added DeployModal component"
echo ""
echo "🔍 Backup saved as: ${BUILDER_FILE}.bak"
echo ""
echo "🧪 Test the changes:"
echo "   npm run dev"
echo ""
echo "❌ If there are any issues, restore the backup:"
echo "   cp ${BUILDER_FILE}.bak $BUILDER_FILE"
