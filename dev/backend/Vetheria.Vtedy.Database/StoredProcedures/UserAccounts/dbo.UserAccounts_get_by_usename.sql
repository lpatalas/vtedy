﻿CREATE PROCEDURE [dbo].[UserAccounts_get_by_usename]
    @username nvarchar(250) = 0
AS
    SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
    SELECT TOP(1) [UserAccountId] AS Id
      ,[UserName]
      ,[Email]
      ,[Password]
  FROM [dbo].[UserAccounts] ua
  WHERE ua.UserName = @username

