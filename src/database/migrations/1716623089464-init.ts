import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1716623089464 implements MigrationInterface {
    name = 'Init1716623089464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UserId\` int NOT NULL AUTO_INCREMENT, \`Name\` varchar(255) NOT NULL, \`Email\` varchar(255) NOT NULL, \`Password\` varchar(255) NOT NULL, \`Dob\` date NULL, \`Avatar\` varchar(255) NULL, \`Gender\` tinyint NULL, \`Phone\` varchar(255) NULL, \`Address\` varchar(255) NULL, \`Role\` tinyint NOT NULL DEFAULT '0', \`IsDeleted\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`UserId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otp\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UserId\` int NOT NULL AUTO_INCREMENT, \`Email\` varchar(256) NOT NULL, \`Name\` varchar(256) NOT NULL, \`Password\` varchar(256) NOT NULL, \`Code\` varchar(4) NOT NULL, \`Type\` varchar(16) NOT NULL, \`Expires\` datetime NOT NULL, \`IsUsed\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`UserId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`CategoryId\` int NOT NULL AUTO_INCREMENT, \`Name\` varchar(125) NOT NULL, \`IsDeleted\` tinyint NOT NULL, PRIMARY KEY (\`CategoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`saved_posts\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`Id\` int NOT NULL AUTO_INCREMENT, \`UserId\` int NOT NULL, \`PostId\` int NOT NULL, \`isSave\` tinyint NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`PostId\` int NOT NULL AUTO_INCREMENT, \`Title\` varchar(250) NOT NULL, \`Content\` text NOT NULL, \`Thumbnail\` varchar(2048) NOT NULL, \`Category\` int NOT NULL, \`Datetime\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`Author\` varchar(125) NOT NULL, \`Tags\` varchar(255) NOT NULL, \`Status\` tinyint NOT NULL, \`Description\` varchar(500) NOT NULL, PRIMARY KEY (\`PostId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_view\` (\`PostId\` int NOT NULL, \`TotalViews\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`PostId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`total_comments\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`PostId\` int NOT NULL, \`TotalComments\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`PostId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment_like\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`Id\` int NOT NULL AUTO_INCREMENT, \`UserId\` int NOT NULL, \`CommentId\` int NOT NULL, \`IsLike\` tinyint NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`CreatedBy\` int NOT NULL DEFAULT '1', \`CreatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedBy\` int NOT NULL DEFAULT '1', \`UpdatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`CommentId\` int NOT NULL AUTO_INCREMENT, \`UserId\` int NOT NULL, \`PostId\` int NOT NULL, \`Content\` varchar(255) NOT NULL, \`ParentCommentId\` int NOT NULL, \`Status\` tinyint NOT NULL DEFAULT '1', PRIMARY KEY (\`CommentId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP TABLE \`comment_like\``);
        await queryRunner.query(`DROP TABLE \`total_comments\``);
        await queryRunner.query(`DROP TABLE \`post_view\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`saved_posts\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`otp\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
