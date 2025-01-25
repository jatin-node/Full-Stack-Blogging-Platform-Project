import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import LinkTool from "@editorjs/link";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = (file) => {
  // Implement the logic to upload the file and return the URL
  return new Promise((resolve, reject) => {
    // Example logic
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        success: 1,
        file: { url: reader.result },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const tools = {
  header: {
    class: Header,
    config: {
      placeholder: "Type your heading...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  embed: Embed,
  marker: Marker,
  inlineCode: InlineCode,
  quote: Quote,
  linkTool: LinkTool,
  code: CodeTool,
};
