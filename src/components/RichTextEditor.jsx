"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// A controlled rich text editor built on CKEditor 5 (Classic build).
// This file is only ever loaded on the client via `next/dynamic` with
// `ssr: false` wherever it's used, because CKEditor touches `window`/
// `document` at import time and cannot run during server rendering.
export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          placeholder: placeholder || "Start typing...",
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ck-editor__editable {
          min-height: 320px;
        }
        .rich-text-editor .ck.ck-toolbar {
          border-radius: 0.75rem 0.75rem 0 0;
        }
        .rich-text-editor .ck.ck-editor__main > .ck-editor__editable {
          border-radius: 0 0 0.75rem 0.75rem;
        }
      `}</style>
    </div>
  );
}
