<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <User class="svg-container" size="14" />
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <Lock class="svg-container" size="14" />
        <el-input
          :key="passwordType"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin(loginFormRef)"
        />
        <Hide v-if="passwordType=='password'" size="14" class="show-pwd" @click="showPwd" />
        <View v-else size="14" class="show-pwd" @click="showPwd" />
      </el-form-item>

      <el-button class="loginbtn" :loading="loading" type="primary" @click.native.prevent="handleLogin(loginFormRef)" >登录</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import CryptoJS from 'crypto-js';
  import { reactive, ref } from 'vue'
  import { useRoute, useRouter } from "vue-router"
  import { User, View, Lock, Hide } from '@element-plus/icons-vue'
  import { store } from '~/store';
  import { Login } from '~/api/index'
  const loginFormRef = ref()

  let loginForm = reactive({
    username: '',
    password: '',
  })
  const loginRules = reactive({
    username: [{ required: true, trigger: "blur", message: '请输入用户名' }],
    password: [{ required: true, trigger: "blur", message: '请输入密码' }],
  })
  let loading = ref<boolean>(false)
  let passwordType = ref<string>("password")
  let router = useRouter()
  let route = useRoute()
  let redirect:any = route.query.redirect
  const showPwd = ()=> {
    if (passwordType.value === "password") {
      passwordType.value = "";
    } else {
      passwordType.value = "password";
    }
  }
  const encodeAesString = (data:string, key:string, iv:string)=> {
    var key1 = CryptoJS.enc.Utf8.parse(key);
    var iv1 = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key1, {
        iv: iv1,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    //返回的是base64格式的密文	
    return encrypted.toString();
  }
  const handleLogin = (formEl:any)=>{
    formEl.validate((valid:any) => {
      if (valid) {
        loading.value = true;
        const key = 'fdf653gsdg34ferg'; // 密钥 长度16  前后端定义好，加盐
        const iv = 'fdf653gsdg34ferg'; // 密钥 长度16
        const encrypted = encodeAesString(loginForm.password, key, iv); // 密文
        let loginData = {
          username: loginForm.username,
          password: encrypted
        }
        Login(loginData).then(res=>{
          if(res.success){
            ElMessage.success("登录成功");
            store.dispatch("user/login", res.data)
            router.push({ path: redirect || "/" });
          }
          console.log(res)
          loading.value = false
        }).catch(err=>{
          loading.value = false
          console.log(err)
        })
        
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;


.login-container {
  height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .el-input {
    height: 40px;
    flex: 1;
    :deep(.el-input__wrapper)  {
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
    :deep(input)  {
      border: 0px;
      background: transparent;
      border-radius: 0px;
      padding: 12px 15px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: $cursor;
      box-shadow: none !important;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 20px;
  }
  .login-form {
    position: relative;
    width: 440px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    height: 30px;
    display: inline-block;
  }

  .title-container {
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 15px;
    top: 0px;
    bottom: 0;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    margin: auto;
  }
  .loginbtn{
    width: 100%;
    margin-bottom: 30px;
    height: 40px;
    font-size: 14px;
  }
}
</style>
