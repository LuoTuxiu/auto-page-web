<template>
  <div class="login-container">
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          Login Form
        </h3>
      </div>

      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="name"
          v-model="userForm.name"
          name="name"
          type="text"
          autocomplete="on"
          placeholder="name"
        />
      </el-form-item>

      <el-form-item prop="passwd">
        <span class="svg-container">
          <svg-icon name="passwd" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwd"
          v-model="userForm.passwd"
          :type="passwordType"
          placeholder="passwd"
          name="passwd"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'passwd' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>

      <el-form-item prop="passwd">
        <span class="svg-container">
          <svg-icon name="passwd" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwd"
          v-model="userForm.confirmPassword"
          :type="passwordType"
          placeholder="confrim passwd"
          name="passwd"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'passwd' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >
        Sign in
      </el-button>

      <div style="position:relative">
        <div class="tips">
          <span>name: admin</span>
          <span>passwd: any</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Input, Form } from 'element-ui'
import { UserModule } from '../../store/modules/user'
@Component({
	name: 'Rigister'
})
export default class extends Vue {
	userForm = {
		name: '',
		passwd: ''
	}
  passwordType: String = 'passwd'
  loading: Boolean = false
  loginRules = {
  }

  private showPwd() {
  	if (this.passwordType === 'passwd') {
  		this.passwordType = ''
  	} else {
  		this.passwordType = 'passwd'
  	}
  	this.$nextTick(() => {
  		(this.$refs.passwd as Input).focus()
  	})
  }

  private handleRegister() {
  	(this.$refs.userForm as Form).validate(async(valid: boolean) => {
  		const data = await UserModule.Register(this.userForm)
  		console.log(data)
  	})
  }
}
</script>

<style lang="scss">
	// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
	@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
		.login-container .el-input {
			input {
				color: $loginCursorColor;
			}
			input::first-line {
				color: $lightGray;
			}
		}
	}

	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				height: 47px;
				background: transparent;
				border: 0px;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $lightGray;
				caret-color: $loginCursorColor;
				-webkit-appearance: none;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $loginBg inset !important;
					-webkit-text-fill-color: #fff !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style lang="scss" scoped>
	.login-container {
		height: 100%;
		width: 100%;
		overflow: hidden;
		background-color: $loginBg;

		.login-form {
			position: relative;
			width: 520px;
			max-width: 100%;
			padding: 160px 35px 0;
			margin: 0 auto;
			overflow: hidden;
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $darkGray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title-container {
			position: relative;

			.title {
				font-size: 26px;
				color: $lightGray;
				margin: 0px auto 40px auto;
				text-align: center;
				font-weight: bold;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $darkGray;
			cursor: pointer;
			user-select: none;
		}
	}
</style>
