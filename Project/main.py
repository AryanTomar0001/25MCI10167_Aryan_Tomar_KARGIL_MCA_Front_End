import heapq
from collections import Counter
import tkinter as tk
from tkinter import messagebox, ttk

# ---------------- HUFFMAN NODE CLASS ----------------
class Node:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq


# ---------------- BUILD HUFFMAN TREE ----------------
def build_huffman_tree(text, steps_box):
    frequency = Counter(text)
    heap = [Node(ch, fr) for ch, fr in frequency.items()]
    heapq.heapify(heap)

    step_num = 1
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = Node(None, left.freq + right.freq)
        merged.left, merged.right = left, right
        heapq.heappush(heap, merged)

        steps_box.insert(tk.END, f"Step {step_num}: Merge {left.char or 'Node'}({left.freq}) + {right.char or 'Node'}({right.freq}) -> Node({merged.freq})")
        step_num += 1

    return heap[0], frequency


# ---------------- GENERATE CODES ----------------
def generate_codes(node, code="", mapping={}):
    if node is None:
        return
    if node.char is not None:
        mapping[node.char] = code
        return
    generate_codes(node.left, code + "0", mapping)
    generate_codes(node.right, code + "1", mapping)
    return mapping


# ---------------- ENCODE / DECODE FUNCTIONS ----------------
def encode_text(text, codes):
    return ''.join(codes[ch] for ch in text)


def decode_text(encoded, root):
    decoded = ""
    node = root
    for bit in encoded:
        node = node.left if bit == "0" else node.right
        if node.char:
            decoded += node.char
            node = root
    return decoded


# ---------------- MAIN FUNCTION TO ENCODE ----------------
def huffman_encode():
    text = text_input.get("1.0", tk.END).strip()
    if not text:
        messagebox.showerror("Error", "Please enter some text!")
        return

    steps_box.delete(0, tk.END)
    codes_box.delete(*codes_box.get_children())
    encoded_output.delete("1.0", tk.END)
    decoded_output.delete("1.0", tk.END)
    ratio_label.config(text="")

    root, freq_table = build_huffman_tree(text, steps_box)
    codes = generate_codes(root)
    encoded = encode_text(text, codes)
    decoded = decode_text(encoded, root)

    # Show Huffman Codes
    for ch, code in codes.items():
        codes_box.insert("", "end", values=(ch, freq_table[ch], code))

    # Show Encoded & Decoded Text
    encoded_output.insert(tk.END, encoded)
    decoded_output.insert(tk.END, decoded)

    # Compression Ratio
    original_bits = len(text) * 8
    encoded_bits = len(encoded)
    ratio = round(original_bits / encoded_bits, 2) if encoded_bits else 1
    ratio_label.config(text=f"Compression Ratio: {ratio}:1")


# ---------------- GUI SETUP ----------------
root_window = tk.Tk()
root_window.title("Huffman Encoding & Decoding Simulator")
root_window.geometry("900x650")
root_window.config(bg="#1E1E1E")

title_label = tk.Label(root_window, text="🧠 Huffman Encoding & Decoding Simulator", 
                       font=("Helvetica", 18, "bold"), fg="#00FFAA", bg="#1E1E1E")
title_label.pack(pady=10)

# Input Frame
input_frame = tk.LabelFrame(root_window, text="Input Text", bg="#1E1E1E", fg="#00FFAA", font=("Helvetica", 12, "bold"))
input_frame.pack(padx=20, pady=10, fill="x")

text_input = tk.Text(input_frame, height=3, font=("Consolas", 12))
text_input.pack(padx=10, pady=10, fill="x")

encode_btn = tk.Button(root_window, text="Encode Text", font=("Helvetica", 12, "bold"), bg="#00FFAA", fg="#000", command=huffman_encode)
encode_btn.pack(pady=5)

# Frequency + Codes Frame
codes_frame = tk.LabelFrame(root_window, text="Character | Frequency | Huffman Code", bg="#1E1E1E", fg="#00FFAA", font=("Helvetica", 12, "bold"))
codes_frame.pack(padx=20, pady=10, fill="x")

columns = ("Character", "Frequency", "Code")
codes_box = ttk.Treeview(codes_frame, columns=columns, show="headings", height=6)
for col in columns:
    codes_box.heading(col, text=col)
    codes_box.column(col, width=150, anchor="center")
codes_box.pack(padx=10, pady=10, fill="x")

# Steps Frame
steps_frame = tk.LabelFrame(root_window, text="Stepwise Merging Process", bg="#1E1E1E", fg="#00FFAA", font=("Helvetica", 12, "bold"))
steps_frame.pack(padx=20, pady=10, fill="x")

steps_box = tk.Listbox(steps_frame, height=7, font=("Consolas", 11))
steps_box.pack(padx=10, pady=10, fill="x")

# Encoded & Decoded Output
output_frame = tk.Frame(root_window, bg="#1E1E1E")
output_frame.pack(padx=20, pady=10, fill="x")

encoded_label = tk.Label(output_frame, text="Encoded Text:", bg="#1E1E1E", fg="#00FFAA", font=("Helvetica", 12, "bold"))
encoded_label.grid(row=0, column=0, sticky="w", padx=5)
encoded_output = tk.Text(output_frame, height=2, width=60, font=("Consolas", 11))
encoded_output.grid(row=0, column=1, padx=5, pady=5)

decoded_label = tk.Label(output_frame, text="Decoded Text:", bg="#1E1E1E", fg="#00FFAA", font=("Helvetica", 12, "bold"))
decoded_label.grid(row=1, column=0, sticky="w", padx=5)
decoded_output = tk.Text(output_frame, height=2, width=60, font=("Consolas", 11))
decoded_output.grid(row=1, column=1, padx=5, pady=5)

# Compression Ratio
ratio_label = tk.Label(root_window, text="", font=("Helvetica", 13, "bold"), fg="#FFD700", bg="#1E1E1E")
ratio_label.pack(pady=10)

root_window.mainloop()
