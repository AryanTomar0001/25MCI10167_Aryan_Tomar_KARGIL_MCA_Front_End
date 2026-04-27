class Node {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

// Build Tree
function buildTree(text) {
  let freq = {};
  for (let ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  let heap = Object.entries(freq).map(([ch, fr]) => new Node(ch, fr));

  let steps = [];

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);

    let left = heap.shift();
    let right = heap.shift();

    let merged = new Node(null, left.freq + right.freq);
    merged.left = left;
    merged.right = right;

    steps.push(`Merge ${left.char || 'Node'}(${left.freq}) + ${right.char || 'Node'}(${right.freq})`);

    heap.push(merged);
  }

  return { root: heap[0], freq, steps };
}

// Generate Codes
function generateCodes(node, code = "", map = {}) {
  if (!node) return;

  if (node.char !== null) {
    map[node.char] = code;
  }

  generateCodes(node.left, code + "0", map);
  generateCodes(node.right, code + "1", map);

  return map;
}

// Encode
function encodeText(text, codes) {
  return text.split("").map(ch => codes[ch]).join("");
}

// Decode
function decodeText(encoded, root) {
  let result = "";
  let node = root;

  for (let bit of encoded) {
    node = bit === "0" ? node.left : node.right;

    if (node.char) {
      result += node.char;
      node = root;
    }
  }

  return result;
}

// Main Function
function encode() {
  let text = document.getElementById("inputText").value;
  if (!text) return alert("Enter text");

  let { root, freq, steps } = buildTree(text);
  let codes = generateCodes(root);

  let encoded = encodeText(text, codes);
  let decoded = decodeText(encoded, root);

  // Show Codes
  let table = document.getElementById("codesTable");
  table.innerHTML = `<tr><th>Char</th><th>Freq</th><th>Code</th></tr>`;

  for (let ch in codes) {
    table.innerHTML += `<tr><td>${ch}</td><td>${freq[ch]}</td><td>${codes[ch]}</td></tr>`;
  }
  
  // Show Steps
  let stepsList = document.getElementById("steps");
  stepsList.innerHTML = "";
  steps.forEach(s => {
    stepsList.innerHTML += `<li>${s}</li>`;
  });

  // Output
  document.getElementById("encoded").innerText = encoded;
  document.getElementById("decoded").innerText = decoded;

  let ratio = (text.length * 8 / encoded.length).toFixed(2);
  document.getElementById("ratio").innerText = `Compression Ratio: ${ratio}:1`;
  drawTree(root);
}


function drawTree(root) {
  // Convert to D3 format
  function convert(node) {
    if (!node) return null;

    let name = node.char !== null 
      ? `${node.char} (${node.freq})` 
      : `(${node.freq})`;

    return {
      name: name,
      children: [
        convert(node.left),
        convert(node.right)
      ].filter(n => n !== null)
    };
  }

  let data = convert(root);

  // Clear old tree
  d3.select("#tree").html("");

  const width = 800;
  const height = 400;

  const svg = d3.select("#tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", "translate(40,40)");

  const treeLayout = d3.tree().size([width - 80, height - 80]);

  const rootNode = d3.hierarchy(data);
  treeLayout(rootNode);

  // Links
  g.selectAll(".link")
    .data(rootNode.links())
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "#ccc");

  // Nodes
  const node = g.selectAll(".node")
    .data(rootNode.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
    .attr("r", 18)
    .attr("fill", "#00ffaa");

  node.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(d => d.data.name)
    .style("font-size", "10px");
}
