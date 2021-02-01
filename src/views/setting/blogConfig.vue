<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="ruleForm"
  >
    <el-form-item
      label="掘金cookie"
      prop="cookie_juejin"
    >
      <el-input v-model="ruleForm.cookie_juejin" />
    </el-form-item>
    <el-form-item
      label="简书cookie"
      prop="cookie_jianshu"
    >
      <el-input v-model="ruleForm.cookie_jianshu" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >
        Save
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { PageSettingModule } from '@/store/modules/setting'
@Component({
	name: 'Setting',
	components: {
	}
})
export default class extends Vue {
	ruleForm = {}

	mounted() {
		this.handleGetLocalBlogDetail()
	}

	submitForm(formName) {
		this.$refs[formName].validate((valid) => {
			if (valid) {
				this.handleSave()
			} else {
				console.log('error submit!!')
				return false
			}
		})
	}

	async handleGetLocalBlogDetail() {
		const [err, result] = await PageSettingModule.getPageSetting()
		if (!err) {
			this.ruleForm = Object.assign({}, result)
		}
	}

	async handleSave() {
		const { cookie_juejin, cookie_jianshu } = this.ruleForm
		const params = {
			cookie_juejin,
			cookie_jianshu
		}
		const [err] = await PageSettingModule.updatePageSettingApi(params)
		if (!err) {
			this.$message({
				type: 'success',
				message: '保存成功'
			})
			// this.$router.push({
			// 	name: 'blogList',
			// 	params: {
			// 	}
			// })
		} else {
			this.$message({
				type: 'warning',
				message: err.message
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.ruleForm{
	width: 900px;
	padding: 20px;
}
</style>
