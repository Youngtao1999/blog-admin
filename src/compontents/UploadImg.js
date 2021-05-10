import React, { useContext, useState } from "react"
import { Upload, message, Button } from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { imgContext } from "../Pages/content/ManageInfo"
import servicePath from "../config/apiUrl"

const UploadImg = (props) => {
  const { setImgUrl } = props;
  const btnName = useContext(imgContext);
  const [ loading, setLoading ] = useState(false);
  const [ imageUrl, setImageUrl ] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 校验图片格式与大小
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅支持JPG/PNG文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setImgUrl(info.file.response.data.image);
        message.success('上传成功');
        setLoading(false);
      });
    }
    if (info.file.status === 'error') {
      message.error('上传失败');
      setLoading(false);
    }
  };

  // const uploadButton = (
  //   <div>
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>上传图片</div>
  //   </div>
  // );

  return (
    <Upload
      name="image"
      // listType="picture-card"
      className="image-uploader"
      showUploadList={false}
      action={servicePath.saveAvatar}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      <Button>{btnName ? btnName : "上传"}</Button>
      {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
    </Upload>
  )
}

export default UploadImg
